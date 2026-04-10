"""
Managed Agents Demo
===================
Demonstrates the Anthropic Managed Agents API:
  1. Create a cloud environment
  2. Create a reusable, versioned agent
  3. Start a session against that agent
  4. Send a user message
  5. Stream events until the agent goes idle or terminates

Usage:
    export ANTHROPIC_API_KEY="sk-ant-..."
    python managed_agents_demo.py

The script is split into two logical sections:
  - ONE-TIME SETUP  : create environment + agent, print IDs to store
  - RUNTIME         : load those IDs, create a session, stream results

In production, run the SETUP block once and persist ENVIRONMENT_ID
and AGENT_ID (e.g. in .env or a secrets manager). The RUNTIME block
runs on every invocation.
"""

import json
import os
import sys

import anthropic

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------
TASK = "List the first 5 prime numbers and briefly explain what makes them prime."
AGENT_NAME = "Demo Assistant"
AGENT_SYSTEM = (
    "You are a helpful assistant. Answer clearly and concisely."
)
MODEL = "claude-opus-4-6"


def setup(client: anthropic.Anthropic) -> tuple[str, str]:
    """ONE-TIME SETUP — run once, save the returned IDs."""

    print("=== ONE-TIME SETUP ===")

    # 1. Create an environment (sandbox container template)
    print("\n[1/2] Creating environment …")
    environment = client.beta.environments.create(
        name="demo-env",
        config={
            "type": "cloud",
            "networking": {"type": "unrestricted"},
        },
    )
    env_id = environment.id
    print(f"      Environment ID : {env_id}")

    # 2. Create an agent (model + system prompt + tools live HERE, not on the session)
    print("\n[2/2] Creating agent …")
    agent = client.beta.agents.create(
        name=AGENT_NAME,
        model=MODEL,
        system=AGENT_SYSTEM,
        tools=[
            {
                "type": "agent_toolset_20260401",
                "default_config": {"enabled": True},
            }
        ],
    )
    agent_id = agent.id
    agent_version = agent.version
    print(f"      Agent ID       : {agent_id}")
    print(f"      Agent Version  : {agent_version}")

    print(
        "\n  Store these values — pass them to run_session() on every invocation.\n"
    )
    return env_id, agent_id


def run_session(
    client: anthropic.Anthropic,
    env_id: str,
    agent_id: str,
    task: str,
) -> None:
    """RUNTIME — runs on every invocation. Loads env/agent by ID."""

    print("=== RUNTIME ===")

    # 1. Create a session that references the pre-created agent
    print(f"\n[1/3] Creating session (agent={agent_id}) …")
    session = client.beta.sessions.create(
        agent=agent_id,          # string shorthand → uses latest version
        environment_id=env_id,
        title="Demo session",
    )
    session_id = session.id
    print(f"      Session ID : {session_id}")
    print(f"      Status     : {session.status}")

    # 2. Open the stream BEFORE sending the message (stream-first pattern)
    print(f"\n[2/3] Opening event stream …")
    print(f'[3/3] Sending message: "{task}"\n')
    print("─" * 60)

    with client.beta.sessions.events.stream(session_id) as stream:
        # Send the user message while the stream is already open
        client.beta.sessions.events.send(
            session_id,
            events=[
                {
                    "type": "user.message",
                    "content": [{"type": "text", "text": task}],
                }
            ],
        )

        # Consume events until the session reaches a terminal idle state
        for event in stream:
            _handle_event(event)

            # Break on termination
            if event.type == "session.status_terminated":
                break

            # Break on idle with a terminal stop_reason (not 'requires_action')
            if event.type == "session.status_idle":
                stop_type = getattr(
                    getattr(event, "stop_reason", None), "type", None
                )
                if stop_type != "requires_action":
                    break

    print("─" * 60)
    print("\nSession complete.")

    # 3. Clean up
    print(f"\nArchiving session {session_id} …")
    client.beta.sessions.archive(session_id)
    print("Done.")


def _handle_event(event) -> None:
    """Pretty-print relevant stream events."""
    etype = event.type

    if etype == "session.status_running":
        print("[status] running")

    elif etype == "agent.message":
        for block in getattr(event, "content", []):
            if getattr(block, "type", None) == "text":
                print(block.text, end="", flush=True)

    elif etype == "agent.thinking":
        # Extended thinking — print a one-liner summary
        for block in getattr(event, "content", []):
            if getattr(block, "type", None) == "thinking":
                preview = (block.thinking or "")[:120].replace("\n", " ")
                print(f"[thinking] {preview} …")

    elif etype == "agent.tool_use":
        name = getattr(event, "name", "?")
        print(f"\n[tool_use] {name}")

    elif etype == "agent.tool_result":
        print("[tool_result] received")

    elif etype == "agent.custom_tool_use":
        # Custom tools require a client-side response — not used in this demo
        tool_name = getattr(event, "tool_name", "?")
        print(f"[custom_tool_use] {tool_name} (not handled in demo)")

    elif etype == "session.status_idle":
        stop_type = getattr(getattr(event, "stop_reason", None), "type", None)
        print(f"\n[status] idle (stop_reason={stop_type})")

    elif etype == "session.status_terminated":
        print("\n[status] terminated")

    elif etype == "session.error":
        print(f"\n[error] {event}", file=sys.stderr)

    elif etype in ("span.model_request_start", "span.model_request_end"):
        usage = getattr(event, "model_usage", None)
        if usage:
            print(
                f"\n[usage] input={usage.input_tokens} "
                f"output={usage.output_tokens} "
                f"cache_read={usage.cache_read_input_tokens}"
            )


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print(
            "Error: ANTHROPIC_API_KEY environment variable is not set.\n"
            "Export it and re-run:\n\n"
            "    export ANTHROPIC_API_KEY='sk-ant-...'\n"
            "    python managed_agents_demo.py\n",
            file=sys.stderr,
        )
        sys.exit(1)

    client = anthropic.Anthropic(api_key=api_key)

    # --- ONE-TIME SETUP ---
    env_id, agent_id = setup(client)

    # --- RUNTIME ---
    run_session(client, env_id, agent_id, TASK)
