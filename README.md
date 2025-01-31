# FrameForge

A decentralized storyboard creation and management system built on Stacks blockchain.

## Features
- Create and mint storyboard frames as NFTs
- Organize frames into sequences with duplicate prevention
- Transfer and trade frames
- Collaborative storyboard creation
- Frame ownership tracking
- Sequence modification tracking
- Frame uniqueness validation within sequences

## Getting Started
1. Clone the repository
2. Install dependencies with `npm install`
3. Run tests with `clarinet test`

## Contract Overview
The system consists of two main contracts:
- `frame.clar`: Core NFT functionality for individual storyboard frames
- `sequence.clar`: Management of frame sequences and collaborative features

### Recent Enhancements
- Added last-modified timestamp tracking for sequences
- Implemented duplicate frame prevention in sequences
- Added sequence details getter function
- Enhanced test coverage for sequence operations
