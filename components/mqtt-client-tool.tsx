"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import mqtt, { type IClientOptions, type MqttClient } from "mqtt";

type ConnectionState = "disconnected" | "connecting" | "connected" | "error";

type SubscriptionDraft = {
  id: string;
  topic: string;
  qos: 0 | 1 | 2;
};

type MessageEntry = {
  id: string;
  topic: string;
  payload: string;
  qos: number;
  retained: boolean;
  timestamp: string;
};

function nextId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

export function MQTTClientTool() {
  const clientRef = useRef<MqttClient | null>(null);
  const subscribedTopicsRef = useRef<Map<string, number>>(new Map());

  const [brokerUrl, setBrokerUrl] = useState("ws://127.0.0.1:9001");
  const [clientId, setClientId] = useState("devtoolsforme-web");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cleanSession, setCleanSession] = useState(true);
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [statusMessage, setStatusMessage] = useState("Not connected.");

  const [subscriptionTopic, setSubscriptionTopic] = useState("sensors/temperature");
  const [subscriptionQos, setSubscriptionQos] = useState<0 | 1 | 2>(0);
  const [subscriptions, setSubscriptions] = useState<SubscriptionDraft[]>([]);

  const [publishTopic, setPublishTopic] = useState("sensors/temperature");
  const [publishPayload, setPublishPayload] = useState('{"value": 22.4}');
  const [publishQos, setPublishQos] = useState<0 | 1 | 2>(0);
  const [retainMessage, setRetainMessage] = useState(false);
  const [messages, setMessages] = useState<MessageEntry[]>([]);

  useEffect(() => {
    return () => {
      clientRef.current?.end(true);
      clientRef.current = null;
    };
  }, []);

  useEffect(() => {
    const client = clientRef.current;
    if (!client || connectionState !== "connected") return;

    const targetTopics = new Map(subscriptions.map((item) => [item.topic, item.qos]));

    for (const [topic] of subscribedTopicsRef.current.entries()) {
      if (!targetTopics.has(topic)) {
        client.unsubscribe(topic);
        subscribedTopicsRef.current.delete(topic);
      }
    }

    for (const [topic, qos] of targetTopics.entries()) {
      if (!subscribedTopicsRef.current.has(topic)) {
        client.subscribe(topic, { qos });
        subscribedTopicsRef.current.set(topic, qos);
      }
    }
  }, [connectionState, subscriptions]);

  const canConnect = useMemo(() => brokerUrl.trim().startsWith("ws://") || brokerUrl.trim().startsWith("wss://"), [brokerUrl]);

  function addSubscription() {
    const topic = subscriptionTopic.trim();
    if (!topic) return;
    setSubscriptions((current) => {
      const existing = current.find((item) => item.topic === topic);
      if (existing) {
        return current.map((item) => (item.topic === topic ? { ...item, qos: subscriptionQos } : item));
      }
      return [...current, { id: nextId("sub"), topic, qos: subscriptionQos }];
    });
    setSubscriptionTopic("");
  }

  function removeSubscription(id: string) {
    setSubscriptions((current) => current.filter((item) => item.id !== id));
  }

  function handleConnect() {
    if (!canConnect) {
      setConnectionState("error");
      setStatusMessage("Use an MQTT over WebSocket URL such as ws://host:port or wss://host:port.");
      return;
    }

    clientRef.current?.end(true);
    clientRef.current = null;
    subscribedTopicsRef.current.clear();

    setConnectionState("connecting");
    setStatusMessage("Connecting...");

    const options: IClientOptions = {
      clientId: clientId.trim() || `devtoolsforme-${Math.random().toString(16).slice(2, 10)}`,
      username: username.trim() || undefined,
      password: password || undefined,
      clean: cleanSession,
      reconnectPeriod: 0,
      connectTimeout: 10_000,
    };

    const client = mqtt.connect(brokerUrl.trim(), options);
    clientRef.current = client;

    client.on("connect", (packet) => {
      setConnectionState("connected");
      setStatusMessage(`Connected (${packet.sessionPresent ? "existing session" : "new session"}).`);
      subscribedTopicsRef.current.clear();
      if (subscriptions.length > 0) {
        const topicMap = Object.fromEntries(subscriptions.map((item) => [item.topic, { qos: item.qos }]));
        client.subscribe(topicMap);
        subscriptions.forEach((item) => subscribedTopicsRef.current.set(item.topic, item.qos));
      }
    });

    client.on("message", (topic, payload, packet) => {
      const text = payload.toString();
      setMessages((current) => [
        {
          id: nextId("msg"),
          topic,
          payload: text,
          qos: packet.qos,
          retained: packet.retain,
          timestamp: new Date().toLocaleTimeString(),
        },
        ...current,
      ].slice(0, 50));
    });

    client.on("error", (error) => {
      setConnectionState("error");
      setStatusMessage(error.message || "Connection error.");
    });

    client.on("close", () => {
      setConnectionState((current) => (current === "error" ? current : "disconnected"));
      setStatusMessage((current) => (current === "Connection error." ? current : "Disconnected."));
      subscribedTopicsRef.current.clear();
    });
  }

  function handleDisconnect() {
    clientRef.current?.end(true);
    clientRef.current = null;
    subscribedTopicsRef.current.clear();
    setConnectionState("disconnected");
    setStatusMessage("Disconnected.");
  }

  function handlePublish() {
    const client = clientRef.current;
    if (!client || connectionState !== "connected") {
      setConnectionState("error");
      setStatusMessage("Connect to a broker before publishing.");
      return;
    }

    const topic = publishTopic.trim();
    if (!topic) {
      setConnectionState("error");
      setStatusMessage("Publish topic is required.");
      return;
    }

    client.publish(topic, publishPayload, { qos: publishQos, retain: retainMessage }, (error) => {
      if (error) {
        setConnectionState("error");
        setStatusMessage(error.message || "Publish failed.");
        return;
      }
      setStatusMessage(`Published to ${topic}.`);
    });
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Browser MQTT</p>
            <p className="mt-1 text-sm text-ink/70">Use MQTT over WebSockets from this page, including brokers on your local network.</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] ${
            connectionState === "connected"
              ? "bg-sage text-lake"
              : connectionState === "connecting"
                ? "bg-amber-100 text-amber-800"
                : connectionState === "error"
                  ? "bg-red-100 text-red-700"
                  : "bg-white text-ink/70"
          }`}>
            {connectionState}
          </span>
        </div>
        <p className="mt-3 rounded-xl border border-ink/10 bg-card px-3 py-2 text-sm text-ink/75">{statusMessage}</p>
        <p className="mt-3 text-sm leading-6 text-ink/65">
          TLS note: browsers can connect to `wss://` brokers that use browser-trusted certificates, but a static client like this cannot load arbitrary CA, client cert, or private key material into the WebSocket handshake.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="space-y-6">
          <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Connection</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Broker URL" value={brokerUrl} onChange={setBrokerUrl} placeholder="ws://192.168.1.50:9001" className="md:col-span-2" />
              <Field label="Client ID" value={clientId} onChange={setClientId} placeholder="devtoolsforme-web" />
              <Field label="Username" value={username} onChange={setUsername} placeholder="optional" />
              <Field label="Password" value={password} onChange={setPassword} placeholder="optional" type="password" />
              <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-card px-4 py-3 text-sm font-medium text-ink/80">
                <input type="checkbox" checked={cleanSession} onChange={(event) => setCleanSession(event.target.checked)} className="accent-accent" />
                Clean session
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handleConnect}
                className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accentDark"
              >
                Connect
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                className="rounded-full border border-ink/10 bg-white/90 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Disconnect
              </button>
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Subscriptions</p>
            <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_140px_auto]">
              <Field label="Topic filter" value={subscriptionTopic} onChange={setSubscriptionTopic} placeholder="devices/+/status" />
              <SelectField label="QoS" value={String(subscriptionQos)} onChange={(value) => setSubscriptionQos(Number(value) as 0 | 1 | 2)} options={["0", "1", "2"]} />
              <div className="flex items-end">
                <button type="button" onClick={addSubscription} className="w-full rounded-full border border-ink/10 bg-card px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-white">
                  Add topic
                </button>
              </div>
            </div>
            <div className="mt-4 space-y-3">
              {subscriptions.length === 0 ? (
                <p className="text-sm text-ink/60">No subscriptions yet.</p>
              ) : (
                subscriptions.map((item) => (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/10 bg-card px-4 py-3">
                    <div>
                      <p className="font-mono text-sm text-ink">{item.topic}</p>
                      <p className="text-xs uppercase tracking-[0.16em] text-lake">QoS {item.qos}</p>
                    </div>
                    <button type="button" onClick={() => removeSubscription(item.id)} className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-canvas">
                      Remove
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Publish</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Topic" value={publishTopic} onChange={setPublishTopic} placeholder="devices/lamp/set" className="md:col-span-2" />
              <SelectField label="QoS" value={String(publishQos)} onChange={(value) => setPublishQos(Number(value) as 0 | 1 | 2)} options={["0", "1", "2"]} />
              <label className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-card px-4 py-3 text-sm font-medium text-ink/80">
                <input type="checkbox" checked={retainMessage} onChange={(event) => setRetainMessage(event.target.checked)} className="accent-accent" />
                Retain message
              </label>
              <label className="block space-y-2 text-sm font-medium text-ink/80 md:col-span-2">
                Payload
                <textarea
                  value={publishPayload}
                  onChange={(event) => setPublishPayload(event.target.value)}
                  rows={7}
                  className="min-h-[160px] w-full rounded-[1.2rem] border border-ink/10 bg-white/90 px-4 py-3 font-mono text-sm text-ink outline-none transition focus:border-accent"
                />
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" onClick={handlePublish} className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accentDark">
                Publish message
              </button>
            </div>
          </section>

          <section className="rounded-[1.4rem] border border-ink/10 bg-white/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-lake">Messages</p>
              <button type="button" onClick={() => setMessages([])} className="rounded-full border border-ink/10 bg-white px-3 py-1.5 text-sm font-medium text-ink transition hover:bg-canvas">
                Clear log
              </button>
            </div>
            <div className="mt-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-ink/60">No incoming messages yet.</p>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="rounded-[1.2rem] border border-ink/10 bg-card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-mono text-sm text-ink">{message.topic}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-lake">{message.timestamp} / QoS {message.qos}{message.retained ? " / retained" : ""}</p>
                      </div>
                    </div>
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words font-mono text-sm leading-6 text-ink">{message.payload}</pre>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text", className = "" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string; className?: string }) {
  return (
    <label className={`block space-y-2 text-sm font-medium text-ink/80 ${className}`}>
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="block space-y-2 text-sm font-medium text-ink/80">
      {label}
      <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-ink/10 bg-white/90 px-4 py-3 text-sm text-ink outline-none transition focus:border-accent">
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
