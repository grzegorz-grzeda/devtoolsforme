"use client";

import { useEffect, useMemo, useState } from "react";
import {
  buildModbusRequestPayload,
  groupHexBytes,
  parseBooleanList,
  parseHexPairs,
  parseNumericInput,
  parseWordList,
  type ModbusRequestKind,
  unpackCoils,
  validateModbusRequestConfig,
} from "@/lib/embedded-advanced";

type SerialParity = "none" | "even" | "odd";

type SerialPortHandle = {
  readable: ReadableStream<Uint8Array> | null;
  writable: WritableStream<BufferSource> | null;
  open: (options: {
    baudRate: number;
    dataBits?: 7 | 8;
    stopBits?: 1 | 2;
    parity?: SerialParity;
    bufferSize?: number;
    flowControl?: "none" | "hardware";
  }) => Promise<void>;
  close: () => Promise<void>;
  getInfo?: () => { usbVendorId?: number; usbProductId?: number };
};

type SerialNavigator = Navigator & {
  serial?: {
    requestPort: () => Promise<SerialPortHandle>;
  };
};

const serialPresets = [
  { id: "9600-8e1", label: "Modbus default 9600 8E1", baudRate: "9600", dataBits: 8 as const, parity: "even" as const, stopBits: 1 as const },
  { id: "19200-8e1", label: "19200 8E1", baudRate: "19200", dataBits: 8 as const, parity: "even" as const, stopBits: 1 as const },
  { id: "38400-8n1", label: "38400 8N1", baudRate: "38400", dataBits: 8 as const, parity: "none" as const, stopBits: 1 as const },
  { id: "115200-8n1", label: "115200 8N1", baudRate: "115200", dataBits: 8 as const, parity: "none" as const, stopBits: 1 as const },
];

const modbusFunctionOptions: { value: ModbusRequestKind; label: string; note: string }[] = [
  { value: "read-coils", label: "01 Read Coils", note: "Read packed coil status bits." },
  { value: "read-discrete-inputs", label: "02 Read Discrete Inputs", note: "Read packed input status bits." },
  { value: "read-holding-registers", label: "03 Read Holding Registers", note: "Read one or more holding registers." },
  { value: "read-input-registers", label: "04 Read Input Registers", note: "Read one or more input registers." },
  { value: "write-single-coil", label: "05 Write Single Coil", note: "Force one coil ON or OFF." },
  { value: "write-single-register", label: "06 Write Single Register", note: "Write one 16-bit register." },
  { value: "write-multiple-coils", label: "0F Write Multiple Coils", note: "Write a sequence of coil bits." },
  { value: "write-multiple-registers", label: "10 Write Multiple Registers", note: "Write a sequence of 16-bit registers." },
  { value: "custom", label: "Custom raw payload", note: "Enter function and payload bytes manually." },
];

function modbusExceptionLabel(code: number) {
  switch (code) {
    case 0x01: return "Illegal function";
    case 0x02: return "Illegal data address";
    case 0x03: return "Illegal data value";
    case 0x04: return "Slave device failure";
    case 0x05: return "Acknowledge";
    case 0x06: return "Slave device busy";
    case 0x08: return "Memory parity error";
    case 0x0a: return "Gateway path unavailable";
    case 0x0b: return "Gateway target failed to respond";
    default: return "Unknown exception";
  }
}

function decodeModbusResponse(request: number[] | null, responseBytes: number[]) {
  if (responseBytes.length < 3) return ["Frame too short to decode."];

  const lines: string[] = [];
  const dataWithoutCrc = responseBytes.slice(0, -2);
  const crcReceived = responseBytes.length >= 2 ? (responseBytes.at(-1)! << 8) | responseBytes.at(-2)! : null;
  const crcCalculated = responseBytes.length >= 2 ? crc16Modbus(dataWithoutCrc) : null;
  const slaveId = responseBytes[0];
  const functionId = responseBytes[1];

  lines.push(`Slave: ${slaveId.toString(16).toUpperCase().padStart(2, "0")}`);
  lines.push(`Function: ${functionId.toString(16).toUpperCase().padStart(2, "0")}`);

  if (crcReceived !== null && crcCalculated !== null) {
    lines.push(`CRC: ${crcReceived === crcCalculated ? "valid" : `invalid (got ${crcReceived.toString(16).toUpperCase().padStart(4, "0")}, expected ${crcCalculated.toString(16).toUpperCase().padStart(4, "0")})`}`);
  }

  if (request && request[0] !== slaveId) lines.push("Warning: response slave does not match request slave.");
  if (request && (functionId & 0x7f) !== request[1]) lines.push("Warning: response function does not match request function.");

  if ((functionId & 0x80) !== 0) {
    const exceptionCode = responseBytes[2] ?? 0;
    lines.push(`Exception: ${modbusExceptionLabel(exceptionCode)} (${exceptionCode.toString(16).toUpperCase().padStart(2, "0")})`);
    return lines;
  }

  if (functionId === 0x01 || functionId === 0x02 || functionId === 0x03 || functionId === 0x04) {
    const byteCount = responseBytes[2] ?? 0;
    const data = responseBytes.slice(3, 3 + byteCount);
    lines.push(`Byte count: ${byteCount}`);
    lines.push(`Data: ${groupHexBytes(data) || "none"}`);

    if ((functionId === 0x01 || functionId === 0x02) && request && request.length >= 6) {
      const requestedCount = (request[4] << 8) | request[5];
      const bits = unpackCoils(data, requestedCount);
      if (bits.length > 0) {
        lines.push(`Bits: ${bits.map((value, index) => `${index}:${value ? "ON" : "OFF"}`).join(", ")}`);
      }
    }

    if (functionId === 0x03 || functionId === 0x04) {
      const registers: string[] = [];
      for (let index = 0; index + 1 < data.length; index += 2) {
        const value = (data[index] << 8) | data[index + 1];
        registers.push(`R${index / 2}: 0x${value.toString(16).toUpperCase().padStart(4, "0")} (${value})`);
      }
      if (registers.length > 0) lines.push(`Registers: ${registers.join(", ")}`);
    }

    return lines;
  }

  if (functionId === 0x05 || functionId === 0x06 || functionId === 0x0f || functionId === 0x10) {
    const address = ((responseBytes[2] ?? 0) << 8) | (responseBytes[3] ?? 0);
    const value = ((responseBytes[4] ?? 0) << 8) | (responseBytes[5] ?? 0);
    lines.push(`Address: 0x${address.toString(16).toUpperCase().padStart(4, "0")}`);
    lines.push(`Value/count: 0x${value.toString(16).toUpperCase().padStart(4, "0")} (${value})`);
    return lines;
  }

  lines.push(`Data: ${groupHexBytes(responseBytes.slice(2, -2)) || "none"}`);
  return lines;
}

function crc16Modbus(bytes: number[]) {
  let crc = 0xffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = crc & 1 ? (crc >> 1) ^ 0xa001 : crc >> 1;
  }
  return crc & 0xffff;
}

async function readWithTimeout(port: SerialPortHandle, timeoutMs: number) {
  if (!port.readable) throw new Error("Selected port is not readable.");

  const reader = port.readable.getReader();
  const received: number[] = [];

  try {
    while (true) {
      const timeout = new Promise<{ timedOut: true }>((resolve) => {
        window.setTimeout(() => resolve({ timedOut: true }), timeoutMs);
      });
      const pendingRead = reader.read().then((result) => ({ ...result, timedOut: false as const }));
      const result = await Promise.race([pendingRead, timeout]);

      if ("timedOut" in result && result.timedOut) {
        if (received.length === 0) throw new Error(`Timed out after ${timeoutMs} ms waiting for a response.`);
        break;
      }

      if (result.done) break;
      if (result.value) received.push(...result.value);
    }
  } finally {
    reader.releaseLock();
  }

  return received;
}

export function ModbusRTUHelperTool() {
  const [preset, setPreset] = useState(serialPresets[0]?.id ?? "custom");
  const [slave, setSlave] = useState("01");
  const [requestKind, setRequestKind] = useState<ModbusRequestKind>("read-holding-registers");
  const [functionCode, setFunctionCode] = useState("03");
  const [payload, setPayload] = useState("00 10 00 02");
  const [startAddress, setStartAddress] = useState("0x0010");
  const [quantity, setQuantity] = useState("2");
  const [singleCoilValue, setSingleCoilValue] = useState(true);
  const [singleRegisterValue, setSingleRegisterValue] = useState("0x1234");
  const [coilList, setCoilList] = useState("1 0 1 1 0 0 0 0");
  const [registerList, setRegisterList] = useState("0x1234 0x5678");
  const [baudRate, setBaudRate] = useState("9600");
  const [dataBits, setDataBits] = useState<7 | 8>(8);
  const [stopBits, setStopBits] = useState<1 | 2>(1);
  const [parity, setParity] = useState<SerialParity>("none");
  const [timeoutMs, setTimeoutMs] = useState("250");
  const [port, setPort] = useState<SerialPortHandle | null>(null);
  const [transportStatus, setTransportStatus] = useState("Disconnected");
  const [response, setResponse] = useState("");
  const [decodedResponse, setDecodedResponse] = useState<string[]>([]);
  const [lastDurationMs, setLastDurationMs] = useState<number | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const serialApi = typeof navigator === "undefined" ? undefined : (navigator as SerialNavigator).serial;

  const requestDefinition = useMemo(() => {
    if (requestKind === "custom") {
      return {
        functionCode: parseNumericInput(functionCode),
        payloadBytes: parseHexPairs(payload),
        note: modbusFunctionOptions.find((option) => option.value === requestKind)?.note ?? "",
      };
    }

    const start = parseNumericInput(startAddress);
    const count = parseNumericInput(quantity);
    const built = buildModbusRequestPayload({
      kind: requestKind,
      startAddress: start ?? 0,
      quantity: count ?? 0,
      coilValue: singleCoilValue,
      registerValue: parseNumericInput(singleRegisterValue) ?? 0,
      coilValues: parseBooleanList(coilList),
      registerValues: parseWordList(registerList),
    });

    return {
      ...built,
      note: modbusFunctionOptions.find((option) => option.value === requestKind)?.note ?? "",
    };
  }, [coilList, functionCode, payload, quantity, registerList, requestKind, singleCoilValue, singleRegisterValue, startAddress]);

  const requestValidation = useMemo(() => validateModbusRequestConfig({
    kind: requestKind,
    startAddress: parseNumericInput(startAddress) ?? undefined,
    quantity: parseNumericInput(quantity) ?? undefined,
    coilValue: singleCoilValue,
    registerValue: parseNumericInput(singleRegisterValue) ?? undefined,
    coilValues: parseBooleanList(coilList),
    registerValues: parseWordList(registerList),
    customPayload: payload,
  }), [coilList, payload, quantity, registerList, requestKind, singleCoilValue, singleRegisterValue, startAddress]);

  const frameBytes = useMemo(() => {
    const slaveValue = parseNumericInput(slave);
    if (slaveValue === null) return null;
    const currentFunctionCode = requestDefinition.functionCode;
    if (currentFunctionCode === null || currentFunctionCode === undefined) return null;
    const bytes = [slaveValue & 0xff, currentFunctionCode & 0xff, ...requestDefinition.payloadBytes];
    if (bytes.length < 2) return null;
    const crc = crc16Modbus(bytes);
    return [...bytes, crc & 0xff, (crc >> 8) & 0xff];
  }, [requestDefinition, slave]);

  const frame = useMemo(() => {
    if (!frameBytes) return null;
    return groupHexBytes(frameBytes);
  }, [frameBytes]);

  function applyPreset(presetId: string) {
    setPreset(presetId);
    const selectedPreset = serialPresets.find((candidate) => candidate.id === presetId);
    if (!selectedPreset) return;
    setBaudRate(selectedPreset.baudRate);
    setDataBits(selectedPreset.dataBits);
    setParity(selectedPreset.parity);
    setStopBits(selectedPreset.stopBits);
  }

  useEffect(() => {
    return () => {
      if (!port) return;
      void port.close().catch(() => undefined);
    };
  }, [port]);

  async function handleConnect() {
    if (!serialApi?.requestPort) {
      setTransportStatus("Web Serial is unavailable in this browser. Use a Chromium-based browser over HTTPS or localhost.");
      return;
    }

    const baud = Number(baudRate);
    if (!Number.isInteger(baud) || baud <= 0) {
      setTransportStatus("Enter a valid baud rate before connecting.");
      return;
    }

    setIsConnecting(true);
    try {
      const selectedPort = await serialApi.requestPort();
      await selectedPort.open({ baudRate: baud, dataBits, stopBits, parity, flowControl: "none" });
      const info = selectedPort.getInfo?.();
      const label = info?.usbVendorId !== undefined && info?.usbProductId !== undefined
        ? `Connected to USB ${info.usbVendorId.toString(16).toUpperCase()}:${info.usbProductId.toString(16).toUpperCase()}`
        : `Connected at ${baud} baud`;
      setPort(selectedPort);
      setTransportStatus(label);
    } catch (error) {
      setTransportStatus(error instanceof Error ? error.message : "Failed to open serial port.");
      setPort(null);
    } finally {
      setIsConnecting(false);
    }
  }

  async function handleDisconnect() {
    if (!port) return;
    try {
      await port.close();
      setTransportStatus("Disconnected");
    } catch (error) {
      setTransportStatus(error instanceof Error ? error.message : "Failed to close serial port.");
    } finally {
      setPort(null);
    }
  }

  async function handleSend() {
    if (!port?.writable) {
      setTransportStatus("Connect to a serial port before sending.");
      return;
    }
    if (!frameBytes) {
      setTransportStatus("Enter a valid Modbus RTU frame first.");
      return;
    }
    if (requestValidation.length > 0) {
      setTransportStatus(requestValidation[0] ?? "Fix the request fields before sending.");
      return;
    }

    const timeout = Number(timeoutMs);
    if (!Number.isFinite(timeout) || timeout <= 0) {
      setTransportStatus("Enter a valid response timeout in milliseconds.");
      return;
    }

    setIsSending(true);
    setResponse("");
    setDecodedResponse([]);
    try {
      const writer = port.writable.getWriter();
      try {
        const startedAt = performance.now();
        await writer.write(new Uint8Array(frameBytes));
        writer.releaseLock();

        const bytes = await readWithTimeout(port, timeout);
        const duration = Math.max(0, Math.round(performance.now() - startedAt));
        setResponse(groupHexBytes(bytes));
        setDecodedResponse(decodeModbusResponse(frameBytes, bytes));
        setLastDurationMs(duration);
        setTransportStatus(`Received ${bytes.length} byte${bytes.length === 1 ? "" : "s"} in ${duration} ms.`);
      } finally {
        try {
          writer.releaseLock();
        } catch {
          // Ignore duplicate release attempts.
        }
      }
    } catch (error) {
      setLastDurationMs(null);
      setTransportStatus(error instanceof Error ? error.message : "Modbus exchange failed.");
    } finally {
      setIsSending(false);
    }
  }

  const canSendFrame = !!port && !!frameBytes && requestValidation.length === 0 && !isSending && !isConnecting;

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Slave<input value={slave} onChange={(event) => setSlave(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        <label className="block space-y-2 text-sm font-semibold text-ink/80">Function<select value={requestKind} onChange={(event) => setRequestKind(event.target.value as ModbusRequestKind)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent">{modbusFunctionOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>
        <div className="rounded-2xl border border-ink/10 bg-white/70 px-4 py-3 text-sm text-ink/75"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Function note</p><p className="mt-2">{requestDefinition.note}</p></div>
      </div>
      {requestKind === "custom" ? (
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Function code<input value={functionCode} onChange={(event) => setFunctionCode(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Payload bytes<input value={payload} onChange={(event) => setPayload(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {(requestKind === "read-coils" || requestKind === "read-discrete-inputs" || requestKind === "read-holding-registers" || requestKind === "read-input-registers" || requestKind === "write-single-coil" || requestKind === "write-single-register" || requestKind === "write-multiple-coils" || requestKind === "write-multiple-registers") ? <label className="block space-y-2 text-sm font-semibold text-ink/80">Start address<input value={startAddress} onChange={(event) => setStartAddress(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label> : null}
          {(requestKind === "read-coils" || requestKind === "read-discrete-inputs" || requestKind === "read-holding-registers" || requestKind === "read-input-registers") ? <label className="block space-y-2 text-sm font-semibold text-ink/80">Quantity<input value={quantity} onChange={(event) => setQuantity(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label> : null}
          {requestKind === "write-single-coil" ? <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm font-semibold text-ink/80"><input type="checkbox" checked={singleCoilValue} onChange={(event) => setSingleCoilValue(event.target.checked)} className="h-4 w-4 accent-accent" />Write coil ON</label> : null}
          {requestKind === "write-single-register" ? <label className="block space-y-2 text-sm font-semibold text-ink/80">Register value<input value={singleRegisterValue} onChange={(event) => setSingleRegisterValue(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label> : null}
          {requestKind === "write-multiple-coils" ? <label className="block space-y-2 text-sm font-semibold text-ink/80 md:col-span-2">Coil values<textarea value={coilList} onChange={(event) => setCoilList(event.target.value)} rows={3} className="min-h-[96px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" /></label> : null}
          {requestKind === "write-multiple-registers" ? <label className="block space-y-2 text-sm font-semibold text-ink/80 md:col-span-2">Register values<textarea value={registerList} onChange={(event) => setRegisterList(event.target.value)} rows={3} className="min-h-[96px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm outline-none transition focus:border-accent" /></label> : null}
        </div>
      )}
      <div className="rounded-[1.4rem] border border-ink/10 bg-canvas p-4 text-sm text-ink/75"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Payload preview</p><p className="mt-2 font-mono text-ink">{requestDefinition.payloadBytes.length > 0 ? groupHexBytes(requestDefinition.payloadBytes) : "No payload bytes yet."}</p></div>
      {requestValidation.length > 0 ? <div className="rounded-[1.4rem] border border-[#f2b8a4] bg-[#fff3ed] p-4 text-sm text-accentDark"><p className="text-xs font-semibold uppercase tracking-[0.18em]">Request checks</p><div className="mt-2 space-y-1">{requestValidation.map((issue) => <p key={issue}>{issue}</p>)}</div></div> : <div className="rounded-[1.4rem] border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Request fields look valid for the selected Modbus function.</div>}
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Frame with CRC (little-endian CRC bytes)</p><p className="mt-2 font-mono text-sm text-ink">{frame ?? "Enter at least slave + function bytes"}</p></div>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Local COM port transport</p>
            <p className="mt-1 text-sm text-ink/70">Uses the browser Web Serial API to write the Modbus RTU request and collect response bytes until the timeout expires. Presets cover common Modbus line settings.</p>
          </div>
          <div className="rounded-full bg-canvas px-3 py-2 text-xs font-medium text-ink/70">{transportStatus}</div>
        </div>

        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Preset<select value={preset} onChange={(event) => applyPreset(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent"><option value="custom">Custom</option>{serialPresets.map((option) => <option key={option.id} value={option.id}>{option.label}</option>)}</select></label>
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Baud<input value={baudRate} onChange={(event) => setBaudRate(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Data bits<select value={dataBits} onChange={(event) => setDataBits(Number(event.target.value) as 7 | 8)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent"><option value="8">8</option><option value="7">7</option></select></label>
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Parity<select value={parity} onChange={(event) => setParity(event.target.value as SerialParity)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent"><option value="none">None</option><option value="even">Even</option><option value="odd">Odd</option></select></label>
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Stop bits<select value={stopBits} onChange={(event) => setStopBits(Number(event.target.value) as 1 | 2)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm outline-none transition focus:border-accent"><option value="1">1</option><option value="2">2</option></select></label>
          <label className="block space-y-2 text-sm font-semibold text-ink/80">Response timeout ms<input value={timeoutMs} onChange={(event) => setTimeoutMs(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm outline-none transition focus:border-accent" /></label>
          <div className="flex items-end gap-3">
            <button type="button" onClick={port ? handleDisconnect : handleConnect} disabled={isConnecting || isSending} className="w-full rounded-full bg-ink px-4 py-3 text-sm font-semibold text-white transition hover:bg-lake disabled:cursor-not-allowed disabled:opacity-60">{isConnecting ? "Connecting..." : port ? "Disconnect" : "Connect"}</button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button type="button" onClick={handleSend} disabled={!canSendFrame} className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-60">{isSending ? "Sending..." : "Send request"}</button>
          {lastDurationMs !== null ? <div className="rounded-full border border-ink/10 bg-white px-3 py-2 text-sm text-ink/75">Round trip: <span className="font-mono">{lastDurationMs} ms</span></div> : null}
        </div>

        <div className="mt-4 rounded-2xl bg-canvas px-4 py-3 text-sm text-ink/75">
          Chromium-based browsers only. This requires a secure origin such as HTTPS or localhost and user permission to open the serial port.
        </div>
      </div>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Response bytes</p><p className="mt-2 font-mono text-sm text-ink">{response || "No response captured yet."}</p></div>
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Decoded response</p><div className="mt-2 space-y-1 text-sm text-ink">{decodedResponse.length > 0 ? decodedResponse.map((line) => <p key={line}>{line}</p>) : <p className="text-ink/70">Normal and exception responses will be parsed automatically after a request completes.</p>}</div></div>
    </div>
  );
}
