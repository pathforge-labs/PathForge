"""
PathForge API — Structured Logging Configuration
===================================================
JSON in production, human-readable in development.

Binds request ID from contextvars to every log entry.

Usage:
    from app.core.logging_config import setup_logging
    setup_logging(debug=True)  # call once at startup
"""

from __future__ import annotations

import logging
import sys

import structlog

from app.core.middleware import get_request_id


def _add_request_id(
    logger: logging.Logger,  # noqa: ARG001
    method_name: str,  # noqa: ARG001
    event_dict: dict,
) -> dict:
    """Inject request ID into every log entry."""
    rid = get_request_id()
    if rid:
        event_dict["request_id"] = rid
    return event_dict


def setup_logging(*, debug: bool = False) -> None:
    """
    Configure structlog for the application.

    Args:
        debug: If True, use human-readable console output.
               If False, use JSON rendering (production).
    """
    # Common processors applied to all log entries
    shared_processors: list[structlog.types.Processor] = [
        structlog.contextvars.merge_contextvars,
        _add_request_id,
        structlog.stdlib.add_log_level,
        structlog.stdlib.add_logger_name,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.UnicodeDecoder(),
    ]

    if debug:
        # Development: colorful, human-readable output
        renderer: structlog.types.Processor = structlog.dev.ConsoleRenderer(
            colors=True,
        )
    else:
        # Production: machine-parseable JSON
        renderer = structlog.processors.JSONRenderer()

    structlog.configure(
        processors=[
            *shared_processors,
            structlog.stdlib.ProcessorFormatter.wrap_for_formatter,
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.stdlib.BoundLogger,
        cache_logger_on_first_use=True,
    )

    # Configure stdlib logging to use structlog formatting
    formatter = structlog.stdlib.ProcessorFormatter(
        processors=[
            structlog.stdlib.ProcessorFormatter.remove_processors_meta,
            renderer,
        ],
    )

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(formatter)

    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(logging.DEBUG if debug else logging.INFO)

    # Suppress noisy third-party loggers
    for noisy_logger in ("uvicorn.access", "httpcore", "httpx", "litellm"):
        logging.getLogger(noisy_logger).setLevel(logging.WARNING)
