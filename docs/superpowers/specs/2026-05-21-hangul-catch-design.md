# Hangul Catch Design

Date: 2026-05-21

## Context

Hangul Catch is a web-based Korean literacy game for children who are just beginning to learn Hangul. Children complete simple words by reaching toward large floating syllable cards and catching the correct card with a hand-closing gesture. The first version should validate the core "catch letters without touching the screen" experience while remaining playable with mouse or touch input when a camera is unavailable.

This project will be built as a standalone app in `hangul-catch`, not as a change to the Superpowers core repository. Hangul Catch is a domain-specific educational game, so it does not belong in Superpowers core or in an upstream PR to that repository.

## Decisions

- Build order: A word-completion game first, then camera hand recognition, then richer learning-loop analytics.
- First MVP still includes simple hand recognition because the touch-free catch interaction is the core concept.
- Target learner: children in preschool or early elementary school who are beginning Hangul.
- Content: 20 mixed two-syllable words from everyday life, animals, and nature.
- Visual direction: storybook journey, suitable for later picture-word connection modes.
- Start flow: guardian notice and consent, camera permission, child start screen, then game.
- Data model: local-only progress storage for the MVP, with no separate data server.

## MVP Scope

The MVP is a storybook-style two-syllable word-completion game. Each round presents a target word with one missing syllable, plus large floating syllable cards. The child catches the correct syllable to complete the word.

Included in the MVP:

- Guardian notice and camera-use explanation.
- Camera permission flow.
- Camera-based hand cursor.
- Simple catch gesture detection.
- Mouse and touch fallback controls.
- 20 two-syllable mixed-topic word prompts.
- Correct and incorrect catch feedback.
- Simple rule-based difficulty adjustment.
- Local progress storage.
- Responsive game screen with large cards and large controls.

Excluded from the MVP:

- Sentence arrangement mode.
- Teacher content editor.
- Guardian dashboard.
- Server sync.
- Accounts or child profiles.
- Raw video, audio, image, biometric, or hand-landmark storage.
- Pull request or change to the Superpowers core repository.

## User Flow

1. The guardian sees a clear notice explaining that camera video is processed in the browser, not saved, and not sent to a server.
2. The guardian confirms they want to continue.
3. The app asks for camera permission and prepares hand detection.
4. If camera setup succeeds, the child sees a large start screen.
5. If camera setup fails or is skipped, the app offers mouse and touch play.
6. The child plays a 20-question word-completion session.
7. The app saves local summary progress and shows a gentle completion screen.

## Gameplay

Each question uses a two-syllable word such as `나무`, `사과`, `우산`, `바다`, `토끼`, `나비`, or `구름`. The game displays the target as a partially completed word, such as `나 _`, and shows the correct syllable with two or three easy distractors.

Cards float slowly inside the play area. Cards are at least 96px on supported screen sizes, and their catch zone is 20-35% larger than the visible card. Correct catches attach the card to the word board. Incorrect catches gently bounce the card away and show corrective feedback such as "소리를 다시 들어봐요" instead of a harsh failure state.

## Input Model

The game has a shared input layer so camera, mouse, and touch can all produce the same game-level events.

```text
Camera stream
Frame sampling
Hand landmark detection
Hand cursor state
Catch gesture parser
Game input event
Word-card game logic
Feedback and difficulty update
Local progress storage
```

Mouse and touch input use the same `aim`, `catch`, and `release` events as camera input. This keeps fallback play consistent with hand-based play and makes the game testable without a webcam.

## Hand Detection

The MVP uses MediaPipe Hand Landmarker through `@mediapipe/tasks-vision`. Initial implementation may run on the main thread to reduce complexity. If performance is poor, inference can move to a Web Worker in a later step.

The first catch parser uses simple 2D signals:

- Aim: hand cursor is inside the expanded card hit area.
- Close: thumb-index distance is below a calibrated threshold.
- Confirm: Aim and Close are both true for about 150ms.
- Cooldown: repeated catches are ignored for about 500ms after a catch.

Single-webcam depth is not treated as reliable. Hand size and landmark `z` values can be considered later as supporting signals, but the MVP uses 2D cursor position and finger distance as the primary signal.

## Difficulty Rules

Difficulty is rule-based and explainable.

- If recent success is high, add one distractor or slightly increase card movement speed.
- If success is moderate, keep the current difficulty and vary feedback.
- If success is low, enlarge cards, slow movement, and reduce distractors.
- If hand tracking is unstable, show a short centering hint and expose the fallback play button.
- If play appears tiring, shorten the session ending and use a gentle rest animation in a later version.

The MVP stores only summary metrics needed for adaptation: prompt ID, success, attempt count, reaction time, current difficulty, and last played date.

## Privacy And Safety

The MVP avoids a data server. Camera frames stay in the browser. The app does not store raw video, still images, audio, biometric identifiers, or raw hand landmarks. It also does not collect a child's name, age, voice, photo, or account identity.

Local progress storage is limited to non-identifying learning state. If a later version adds server sync, guardian dashboard, teacher tools, accounts, or multiple-device progress, that version must include a separate privacy design covering consent, data minimization, retention, deletion, and security controls.

This design follows a conservative reading of child privacy guidance. FTC COPPA guidance treats child photos, videos, audio, persistent identifiers, and biometric identifiers as personal information. Korean guidance emphasizes legal guardian consent and minimum necessary collection for children under 14.

## Technical Architecture

The app will use TypeScript and Vite. The MVP game screen should use DOM and CSS rather than PixiJS. DOM/CSS is enough for large Hangul cards, storybook UI, consent screens, fallback controls, responsive layout, and accessible text. PixiJS can be introduced later if animation complexity grows.

Primary modules:

- `app`: screen flow and route-like state.
- `game`: word prompts, round state, card state, scoring, and difficulty.
- `input`: common input events and camera/mouse/touch adapters.
- `vision`: camera setup and MediaPipe hand landmark integration.
- `progress`: local progress persistence.
- `ui`: reusable screens and components.

## Screens

- Guardian notice: explains camera use, local processing, fallback control, and session length.
- Camera setup: requests permission, shows detection status, and offers fallback play.
- Child start: storybook-style start screen with one large button and the session size.
- Game: target word board, floating cards, hand cursor, feedback line, and progress indicator.
- Completion: gentle celebration, summary, and replay option.

## Error Handling

- Camera permission denied: continue with mouse/touch mode.
- MediaPipe loading failure: continue with mouse/touch mode and show a plain-language note.
- No hand detected: show "손을 화면 가운데로 보여주세요" and keep the game paused or slow.
- Hand tracking unstable: reduce speed and expose fallback controls.
- Local storage unavailable: continue the session without persistence and show no blocking error.

## Verification Criteria

The MVP is complete when:

- A user can finish a 20-question session with mouse or touch and no camera.
- A user can grant camera permission, see a hand cursor, and catch a card with a simple closing gesture.
- Correct and incorrect catches update the word board and feedback state correctly.
- Local progress survives a refresh.
- The game remains usable on desktop and tablet-sized screens.
- Cards remain at least 96px where supported, and controls do not overlap.
- Camera frames and raw hand landmarks are not stored or sent to a server.

## Future Extensions

- Picture-to-word mode using the storybook visual direction.
- Sentence arrangement mode.
- More nuanced distractors for similar letters and sounds.
- Web Worker hand inference if needed for performance.
- Guardian dashboard and server sync after a separate privacy review.
- Teacher content editor as a later standalone feature.
