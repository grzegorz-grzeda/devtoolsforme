"use client";

import { DragEvent, useEffect, useMemo, useRef, useState } from "react";
import { CopyButton } from "@/components/copy-button";
import { parse, Namespace, Type } from "protobufjs";

type InputMode = "json" | "hex" | "base64";

type SchemaState = {
    error: string;
    typeNames: string[];
    root: ReturnType<typeof parse>["root"] | null;
};

const SAMPLE_SCHEMA = `syntax = "proto3";

package devtoolsforme.protobuf;

message SensorReading {
  string device_id = 1;
  uint32 sample_index = 2;
  float temperature_c = 3;
  repeated uint32 adc_samples = 4;
  Status status = 5;
}

enum Status {
  STATUS_UNKNOWN = 0;
  STATUS_OK = 1;
  STATUS_WARN = 2;
}
`;

const SAMPLE_JSON = `{
  "device_id": "lab-node-7",
  "sample_index": 18,
  "temperature_c": 24.75,
  "adc_samples": [4021, 3988, 4010],
  "status": "STATUS_OK"
}`;

function collectMessageTypes(namespace: Namespace, prefix = ""): string[] {
    return namespace.nestedArray.flatMap((nested) => {
        const fullName = prefix ? `${prefix}.${nested.name}` : nested.name;

        if (nested instanceof Type) {
            return [fullName];
        }

        if (nested instanceof Namespace) {
            return collectMessageTypes(nested, fullName);
        }

        return [] as string[];
    });
}

function cleanHexInput(input: string) {
    return input.replace(/0x/gi, "").replace(/[^0-9a-f]/gi, "");
}

function hexToBytes(input: string) {
    const cleaned = cleanHexInput(input);
    if (!cleaned) return new Uint8Array();
    if (cleaned.length % 2 !== 0) {
        throw new Error("Hex payload must contain an even number of digits.");
    }

    const bytes = new Uint8Array(cleaned.length / 2);
    for (let index = 0; index < cleaned.length; index += 2) {
        bytes[index / 2] = Number.parseInt(cleaned.slice(index, index + 2), 16);
    }

    return bytes;
}

function bytesToHex(bytes: Uint8Array) {
    return Array.from(bytes, (value) => value.toString(16).toUpperCase().padStart(2, "0")).join(" ");
}

function bytesToBase64(bytes: Uint8Array) {
    let binary = "";
    bytes.forEach((value) => {
        binary += String.fromCharCode(value);
    });
    return btoa(binary);
}

function base64ToBytes(input: string) {
    const normalized = input.trim().replace(/\s+/g, "");
    if (!normalized) return new Uint8Array();

    try {
        const binary = atob(normalized);
        return Uint8Array.from(binary, (character) => character.charCodeAt(0));
    } catch {
        throw new Error("Base64 payload is not valid.");
    }
}

function formatJson(value: unknown) {
    return JSON.stringify(value, null, 2);
}

export function ProtobufParserTool() {
    const [schema, setSchema] = useState(SAMPLE_SCHEMA);
    const [messageTypeName, setMessageTypeName] = useState("devtoolsforme.protobuf.SensorReading");
    const [inputMode, setInputMode] = useState<InputMode>("json");
    const [payload, setPayload] = useState(SAMPLE_JSON);
    const [schemaFileName, setSchemaFileName] = useState("");
    const [payloadFileName, setPayloadFileName] = useState("");
    const [payloadDragActive, setPayloadDragActive] = useState(false);
    const [fileLoadError, setFileLoadError] = useState("");
    const schemaInputRef = useRef<HTMLInputElement | null>(null);
    const payloadInputRef = useRef<HTMLInputElement | null>(null);

    const schemaState = useMemo<SchemaState>(() => {
        if (!schema.trim()) {
            return { error: "Provide a `.proto` schema to validate and parse messages.", typeNames: [], root: null };
        }

        try {
            const parsed = parse(schema, { keepCase: true });
            const typeNames = collectMessageTypes(parsed.root);
            return { error: "", typeNames, root: parsed.root };
        } catch (error) {
            return {
                error: error instanceof Error ? error.message : "Schema could not be parsed.",
                typeNames: [],
                root: null,
            };
        }
    }, [schema]);

    useEffect(() => {
        if (!schemaState.typeNames.length) {
            return;
        }

        if (!schemaState.typeNames.includes(messageTypeName)) {
            setMessageTypeName(schemaState.typeNames[0]);
        }
    }, [messageTypeName, schemaState.typeNames]);

    const selectedType = useMemo(() => {
        if (!schemaState.root || !messageTypeName) {
            return null;
        }

        const reflection = schemaState.root.lookup(messageTypeName);
        return reflection instanceof Type ? reflection : null;
    }, [messageTypeName, schemaState.root]);

    const payloadResult = useMemo(() => {
        if (schemaState.error) {
            return {
                decodedJson: "",
                encodedBase64: "",
                encodedHex: "",
                error: "Fix the schema before validating a payload.",
                fieldRows: [] as Array<{ id: number; name: string; type: string; rule: string }>,
            };
        }

        if (!selectedType) {
            return {
                decodedJson: "",
                encodedBase64: "",
                encodedHex: "",
                error: "Choose a message type from the provided schema.",
                fieldRows: [] as Array<{ id: number; name: string; type: string; rule: string }>,
            };
        }

        const fieldRows = selectedType.fieldsArray.map((field) => ({
            id: field.id,
            name: field.name,
            type: field.type,
            rule: field.repeated ? "repeated" : field.optional ? "optional" : "required/value",
        }));

        try {
            if (inputMode === "json") {
                const parsedJson = JSON.parse(payload);
                const validationError = selectedType.verify(parsedJson);
                if (validationError) {
                    return {
                        decodedJson: "",
                        encodedBase64: "",
                        encodedHex: "",
                        error: validationError,
                        fieldRows,
                    };
                }

                const message = selectedType.fromObject(parsedJson);
                const encoded = selectedType.encode(message).finish();
                const decoded = selectedType.toObject(selectedType.decode(encoded), {
                    enums: String,
                    longs: String,
                    defaults: false,
                    arrays: true,
                    objects: true,
                });

                return {
                    decodedJson: formatJson(decoded),
                    encodedBase64: bytesToBase64(encoded),
                    encodedHex: bytesToHex(encoded),
                    error: "",
                    fieldRows,
                };
            }

            const bytes = inputMode === "hex" ? hexToBytes(payload) : base64ToBytes(payload);
            const decodedMessage = selectedType.decode(bytes);
            const decoded = selectedType.toObject(decodedMessage, {
                enums: String,
                longs: String,
                defaults: false,
                arrays: true,
                objects: true,
            });
            const validationError = selectedType.verify(decoded);

            return {
                decodedJson: formatJson(decoded),
                encodedBase64: bytesToBase64(bytes),
                encodedHex: bytesToHex(bytes),
                error: validationError ?? "",
                fieldRows,
            };
        } catch (error) {
            return {
                decodedJson: "",
                encodedBase64: "",
                encodedHex: "",
                error: error instanceof Error ? error.message : "Payload could not be parsed.",
                fieldRows,
            };
        }
    }, [inputMode, payload, schemaState.error, selectedType]);

    async function loadSchemaFile(file: File) {
        try {
            const text = await file.text();
            setSchema(text);
            setSchemaFileName(file.name);
            setFileLoadError("");
        } catch {
            setFileLoadError("Schema file could not be read.");
        }
    }

    async function loadPayloadFile(file: File) {
        try {
            const looksBinary =
                file.type === "application/octet-stream" || /\.(pb|bin|protobuf)$/i.test(file.name);

            if (looksBinary) {
                const bytes = new Uint8Array(await file.arrayBuffer());
                if (inputMode === "base64") {
                    setPayload(bytesToBase64(bytes));
                } else {
                    setInputMode("hex");
                    setPayload(bytesToHex(bytes));
                }
            } else {
                setPayload(await file.text());
            }

            setPayloadFileName(file.name);
            setFileLoadError("");
        } catch {
            setFileLoadError("Payload file could not be read.");
        }
    }

    function handlePayloadDrop(event: DragEvent<HTMLLabelElement>) {
        event.preventDefault();
        setPayloadDragActive(false);
        const [file] = Array.from(event.dataTransfer.files);
        if (!file) {
            return;
        }
        void loadPayloadFile(file);
    }

    return (
        <div className="space-y-5">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-ink/80">Protobuf schema</p>
                        <div className="flex flex-wrap gap-2">
                            <input
                                ref={schemaInputRef}
                                type="file"
                                accept=".proto,text/plain"
                                className="hidden"
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) {
                                        void loadSchemaFile(file);
                                    }
                                    event.target.value = "";
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => schemaInputRef.current?.click()}
                                className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
                            >
                                Load .proto file
                            </button>
                        </div>
                    </div>
                    <textarea
                        value={schema}
                        onChange={(event) => setSchema(event.target.value)}
                        rows={16}
                        className="min-h-[320px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm text-ink outline-none transition focus:border-accent"
                    />
                    <p className="text-xs text-ink/60">{schemaFileName ? `Loaded schema file: ${schemaFileName}` : "Paste a schema or load a local .proto file."}</p>
                </div>

                <div className="space-y-4">
                    <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Schema status</p>
                        {schemaState.error ? (
                            <p className="mt-3 rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{schemaState.error}</p>
                        ) : (
                            <p className="mt-3 rounded-2xl bg-sage px-4 py-3 text-sm text-lake">
                                Parsed successfully. Found {schemaState.typeNames.length} message type{schemaState.typeNames.length === 1 ? "" : "s"}.
                            </p>
                        )}
                    </div>

                    <label className="block space-y-2 text-sm font-semibold text-ink/80">
                        Message type
                        <select
                            value={messageTypeName}
                            onChange={(event) => setMessageTypeName(event.target.value)}
                            className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
                            disabled={!schemaState.typeNames.length}
                        >
                            {schemaState.typeNames.length ? (
                                schemaState.typeNames.map((typeName) => (
                                    <option key={typeName} value={typeName}>
                                        {typeName}
                                    </option>
                                ))
                            ) : (
                                <option value="">No message types available</option>
                            )}
                        </select>
                    </label>

                    <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                        <div className="mb-3 flex flex-wrap gap-2">
                            {([
                                ["json", "JSON payload"],
                                ["hex", "Hex bytes"],
                                ["base64", "Base64"],
                            ] as const).map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setInputMode(value)}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${inputMode === value ? "bg-ink text-white" : "border border-ink/10 bg-white text-ink hover:bg-canvas"
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <p className="text-sm text-ink/70">
                            JSON mode validates the message against the schema and emits the wire format. Hex and Base64 modes decode the wire payload back into a structured object.
                        </p>
                    </div>

                    <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4 text-sm text-ink/75">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lake">Accepted input</p>
                        <p className="mt-2 font-mono">JSON: object matching the selected message type</p>
                        <p className="mt-1 font-mono">Hex: 0A 0A 6C 61 62 2D 6E 6F 64 65 2D 37</p>
                        <p className="mt-1 font-mono">Base64: CgpsYWItbm9kZS03</p>
                        <p className="mt-3 text-xs text-ink/60">Drop a `.json`, `.txt`, `.pb`, `.bin`, or `.protobuf` file onto the payload area to load sample data directly.</p>
                    </div>
                </div>
            </div>

            <label
                className={`block space-y-2 rounded-[1.6rem] border-2 border-dashed p-3 text-sm font-semibold text-ink/80 transition ${payloadDragActive ? "border-accent bg-[#fff2eb]" : "border-transparent"}`}
                onDragOver={(event) => {
                    event.preventDefault();
                    setPayloadDragActive(true);
                }}
                onDragLeave={() => setPayloadDragActive(false)}
                onDrop={handlePayloadDrop}
            >
                <div className="flex items-center justify-between gap-3">
                    <span>{inputMode === "json" ? "Payload JSON" : inputMode === "hex" ? "Payload hex bytes" : "Payload Base64"}</span>
                    <div className="flex flex-wrap gap-2">
                        <input
                            ref={payloadInputRef}
                            type="file"
                            accept=".json,.txt,.pb,.bin,.protobuf,.b64"
                            className="hidden"
                            onChange={(event) => {
                                const file = event.target.files?.[0];
                                if (file) {
                                    void loadPayloadFile(file);
                                }
                                event.target.value = "";
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => payloadInputRef.current?.click()}
                            className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
                        >
                            Load payload file
                        </button>
                    </div>
                </div>
                <textarea
                    value={payload}
                    onChange={(event) => setPayload(event.target.value)}
                    rows={10}
                    className="min-h-[220px] w-full rounded-[1.4rem] border border-ink/10 bg-white/80 px-4 py-4 font-mono text-sm text-ink outline-none transition focus:border-accent"
                />
                <p className="text-xs text-ink/60">
                    {payloadFileName
                        ? `Loaded payload file: ${payloadFileName}`
                        : "Paste a payload, load a file, or drag one here. Binary drops switch to hex mode unless Base64 mode is active."}
                </p>
            </label>

            {fileLoadError ? (
                <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{fileLoadError}</p>
            ) : null}

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Validation</h2>
                        <CopyButton value={payloadResult.error ? payloadResult.error : "Valid payload"} />
                    </div>
                    {payloadResult.error ? (
                        <p className="rounded-2xl bg-[#fde7df] px-4 py-3 text-sm text-accentDark">{payloadResult.error}</p>
                    ) : (
                        <p className="rounded-2xl bg-sage px-4 py-3 text-sm text-lake">
                            Payload matches the selected schema and message type.
                        </p>
                    )}
                </div>

                <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                    <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">Selected fields</h2>
                    {payloadResult.fieldRows.length ? (
                        <div className="mt-3 space-y-2">
                            {payloadResult.fieldRows.map((field) => (
                                <div key={`${field.id}-${field.name}`} className="rounded-2xl border border-ink/10 bg-white/80 px-3 py-2 text-sm text-ink">
                                    <p className="font-mono text-xs text-lake">#{field.id} {field.name}</p>
                                    <p className="mt-1 text-xs text-ink/70">{field.type} · {field.rule}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-3 text-sm text-ink/70">No fields available until a valid message type is selected.</p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-3">
                {[
                    ["Decoded JSON", payloadResult.decodedJson],
                    ["Wire hex", payloadResult.encodedHex],
                    ["Wire Base64", payloadResult.encodedBase64],
                ].map(([label, value]) => (
                    <div key={label} className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
                        <div className="mb-3 flex items-center justify-between gap-3">
                            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-lake">{label}</h2>
                            <CopyButton value={value} />
                        </div>
                        <pre className="overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-7 text-ink">
                            {value || "Output will appear here once the schema and payload are valid."}
                        </pre>
                    </div>
                ))}
            </div>
        </div>
    );
}