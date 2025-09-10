# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of @a24z/mermaid-parser
- Lightweight Mermaid diagram validation without rendering
- Support for all major Mermaid diagram types
- DOM stubs for server-side environments
- TypeScript support with full type definitions
- Comprehensive test suite
- API for validation, parsing, and diagram type detection
- ~97% size reduction compared to full Mermaid library

### Features
- `validate()` - Validate Mermaid diagram syntax
- `parse()` - Parse diagrams with detailed error information
- `isSupported()` - Check diagram type support
- `getSupportedDiagrams()` - List all supported diagram types
- `getDiagramType()` - Detect diagram type without validation

### Supported Diagram Types
- Flowcharts (`graph`, `flowchart`)
- Sequence Diagrams (`sequenceDiagram`)
- Class Diagrams (`classDiagram`)
- State Diagrams (`stateDiagram`, `stateDiagram-v2`)
- Entity Relationship Diagrams (`erDiagram`)
- User Journey Maps (`journey`)
- Gantt Charts (`gantt`)
- Pie Charts (`pie`)
- Git Graphs (`gitGraph`)
- Mindmaps (`mindmap`)
- Timelines (`timeline`)
- Quadrant Charts (`quadrantChart`)
- Requirement Diagrams (`requirementDiagram`)
- C4 Diagrams (Context, Container, Component, Dynamic, Deployment)
- Sankey Diagrams (`sankey-beta`)
- Block Diagrams (`block-beta`)
- Packet Diagrams (`packet-beta`)
- Architecture Diagrams (`architecture-beta`)
- XY Charts (`xychart-beta`)