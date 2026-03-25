p5 TD — Tower Defense Capstone Project
A browser-based tower defense game built in JavaScript using the p5.js creative coding library, developed as a CS30 capstone project. Inspired by the popular tower defense game Kingdom Rush by Ironhide Game Studio, p5 TD demonstrates core object-oriented programming principles through an interactive and fully playable game.

Design & Architecture:
The codebase is organized across three primary JavaScript files — sketch.js, towers.js, and enemies.js — each responsible for a distinct domain of the game. The project makes use of OOP through dedicated classes for Enemy, Tower, and a Wave/Level manager, keeping game logic modular and maintainable. Visual elements are rendered entirely using p5.js's built-in shape-drawing functions, giving the game a clean geometric aesthetic without relying on external sprites or image assets. Audio is handled via the p5.sound library, with sound files stored in a dedicated Audio/ folder.

Gameplay:
Players place and manage towers along a fixed map path to defend against waves of incoming enemies. p5 TD features multiple enemy types and tower types, each with distinct stats and roles. A gold-based economy drives strategic decision-making: players begin with a set amount of gold, earn more by defeating enemies (with stronger enemies yielding greater rewards), and receive a bonus payout for successfully completing each wave.
The stage consists of 8 waves of increasing difficulty. Players start with 20 lives — enemies that reach the exit cost lives, with tougher enemies draining more than one. The game is lost if all lives are depleted. Surviving all 8 waves wins the stage, and players who finish without losing a single life are awarded a 3-star victory, rewarding flawless defense.
