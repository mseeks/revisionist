# Revisionist - Game Design Document

## Game Concept

**Revisionist** is a strategic text-based game where players attempt to alter history by sending brief messages to historical figures across different time periods. Players must achieve AI-generated objectives through careful selection of figures, strategic message crafting, and adaptive planning in the face of probabilistic outcomes.

## Core Gameplay Loop

1. **AI-Generated Objective**: AI creates a unique grand historical goal requiring cross-timeline coordination (e.g., "Prevent World War I" or "Accelerate the Industrial Revolution")
2. **Strategic Planning**: Choose which historical figures to contact and plan your initial approach
3. **Iterative Message Cycle**: For each of your up to 5 messages:
   - **Message Dispatch**: Send one message (160 characters) to a chosen historical figure
   - **Probabilistic Resolution**: Message triggers a D20 dice roll determining outcome magnitude and direction
   - **Timeline Update**: Observe immediate consequences and ripple effects across history
   - **Progress Assessment**: Receive feedback on how this action affected your objective
   - **Strategic Adaptation**: Adjust your remaining approach based on results
4. **Dynamic Completion**: Game ends when you either achieve your objective early or exhaust all 5 messages
5. **Final Evaluation**: AI provides comprehensive assessment of your strategy's ultimate historical impact

## Core Rules and Mechanics

### Message System
- **Total Message Budget**: 5 messages per game session
- **Character Limit**: 160 characters per message (SMS length)
- **Figure Selection**: Contact 1-5 different historical figures from any time periods
- **Message Distribution**: Freely allocate your 5 messages among chosen figures (e.g., 5 messages to one person, 1 message each to 5 different people, or any combination)
- **Content Freedom**: Any message content is valid - creativity and strategic thinking matter more than historical knowledge

### Probabilistic Outcome System
Every message triggers a **D20 dice roll** that determines the outcome's magnitude:

- **1-2 (Critical Failure)**: Catastrophic disaster - message creates major unintended consequences that actively harm your objective
- **3-7 (Failure)**: Negative outcome - message backfires, creates setbacks, or is poorly received
- **8-13 (Neutral)**: Minimal impact - figure is unmoved, confused, mildly interested, or distracted
- **14-18 (Success)**: Positive outcome - message resonates and creates desired change toward your objective
- **19-20 (Critical Success)**: Monumental impact - extraordinary results that exceed all expectations

**Key Characteristics:**
- Extreme outcomes (both positive and negative) are rare, moderate results are common
- Identical messages can yield vastly different results across playthroughs
- Strategic risk: catastrophic failures can derail entire plans, while critical successes can achieve objectives with fewer messages

### AI System Architecture
A sophisticated dual-layer AI system creates authentic character interactions while maintaining strategic gameplay:

**Character Layer**: 
- **Historical Figure AI**: Responds authentically based on personality, era, and dice outcome
- Characters remain unaware of player's ultimate objective (e.g., Franz Ferdinand doesn't know about "Prevent WWI")
- Dice outcomes influence response magnitude and decision-making without breaking character immersion
- Returns structured output: `{message: "what they say", action: "what they decide to do"}`
- Maintains historical authenticity and personality consistency across all outcomes

**Timeline Layer**:
- **Timeline Evaluation AI**: Analyzes character actions and decisions for historical impact toward player's objective
- Receives dice roll result, character message, and character action for comprehensive analysis
- Calculates progress changes based on character decisions and their cascading effects
- Provides narrative explanations connecting personal choices to grand historical outcomes
- Uses natural language inputs from Character Layer for rich contextual understanding

**Supporting Systems**:
- **Objective Generator AI**: Creates unique grand historical goals for each game session requiring multi-figure coordination
- **Timeline Synthesis AI**: Tracks how conversations across different time periods interact and compound

## Strategic Gameplay Elements

### Adaptive Strategy System
- **Dual-Layer Feedback**: Character responses show immediate personal reactions, while timeline analysis reveals broader historical implications
- **Dynamic Planning**: Adjust your approach based on both character relationships and timeline evaluation results
- **Early Victory Potential**: Achieve objectives through character decisions that create unexpected historical cascades
- **Risk Mitigation**: Respond to setbacks by changing messaging strategies or pivoting to different historical moments

### Cross-Timeline Strategy
- **Temporal Synergy**: Actions in one era can amplify or diminish effects in another
- **Message Allocation**: Decide message-by-message how to best use your remaining attempts
- **Cascading Effects**: Watch how each action creates new opportunities or complications for subsequent messages
- **Strategic Pivoting**: Successful players adapt their figure selection and messaging based on emerging timeline developments

### Success Evaluation Criteria
The AI evaluates your final outcome based on:
- **Objective Achievement**: Did you accomplish the stated historical goal?
- **Timeline Coherence**: How logically do the altered events flow together?
- **Unintended Consequences**: What positive or negative side effects occurred?
- **Strategic Efficiency**: How effectively did you use your limited messages?

Success levels range from **Complete Failure** through **Narrow Victory** to **Extraordinary Success**, with most outcomes falling in nuanced middle categories that partially achieve objectives while creating new complications.

## Sample Gameplay: AI-Generated Objective

### AI-Generated Objective
*The Objective Generator AI creates:* **"Prevent the outbreak of World War I through strategic interventions across multiple time periods and key figures."**

### Player's Adaptive Strategy

#### Message 1: Testing the Waters
**Target**: Otto von Bismarck (1878)  
*Message*: "Your alliance system will doom Europe to unprecedented war. Consider economic unity over military pacts."  
**Dice Roll**: 15 (Success) → Bismarck begins drafting economic cooperation treaties instead of military alliances  
*Progress Update*: "The Triple Alliance shifts toward trade agreements. European nations begin viewing economic cooperation as preferable to military deterrence. **Objective Progress: 25% - Good foundation laid**"

*Player Decision: Encouraged by this success, continue targeting key decision-makers closer to 1914.*

#### Message 2: Building on Success
**Target**: Archduke Franz Ferdinand (1913)  
*Message*: "Your future assassination sparks global war. Increase your security and avoid Sarajevo on June 28, 1914."  
**Dice Roll**: 2 (Critical Failure)

*Character Response*:
- **Message**: "These cryptic warnings... they suggest a conspiracy far darker than I imagined. If enemies plot against me, then all of Serbia must be suspect."
- **Action**: "Becomes deeply paranoid about the warning and demands immediate military mobilization against perceived Serbian threats"

*Timeline Analysis*: "Franz Ferdinand's paranoid interpretation has accelerated Austria-Hungary toward preemptive military action against Serbia, ironically bringing the very conflict closer that the message intended to prevent. His influence with the Emperor makes this development particularly dangerous for European stability."

*Progress Update*: **Objective Progress: -15% - Major setback threatens earlier diplomatic gains**

*Player Decision: Crisis! Need to counteract this disaster with diplomatic intervention.*

#### Message 3: Damage Control
**Target**: Kaiser Wilhelm II (1913)  
*Message*: "Your cousin George and cousin Nicholas seek peace. Family bonds are stronger than empire. Choose cooperation."  
**Dice Roll**: 18 (Success)

*Character Response*:
- **Message**: "Mein friend, you speak wisdom about family bonds. Perhaps it is time to reach beyond the formalities of state."
- **Action**: "Begins writing personal letters to King George V and Tsar Nicholas II proposing an informal family summit to discuss European tensions"

*Timeline Analysis*: "Kaiser Wilhelm II's pivot toward family diplomacy creates unprecedented channels for conflict resolution. His direct correspondence with his royal cousins bypasses traditional diplomatic protocols, potentially defusing the mounting tensions that Franz Ferdinand's paranoia has inflamed."

*Progress Update*: **Objective Progress: 25% - Diplomatic breakthrough counteracts earlier setback**

*Player Decision: The diplomatic approach is working. Target the potential American involvement to prevent escalation.*

#### Message 4: Securing Neutrality
**Target**: Woodrow Wilson (1917)  
*Message*: "America's entry into European war creates precedent for endless global conflict. Choose isolation and prosperity."  
**Dice Roll**: 20 (Critical Success)

*Character Response*:
- **Message**: "Your words illuminate a truth I have long sensed but not articulated. America must not become entangled in the endless quarrels of the Old World."
- **Action**: "Experiences a profound conversion to absolute neutrality and begins drafting a new doctrine of permanent American hemispheric isolation"

*Timeline Analysis*: "Wilson's dramatic policy reversal removes the crucial factor that historically transformed a European conflict into a global war. Without American intervention, any remaining European conflict would likely burn out quickly due to limited resources and lack of external support. This represents a fundamental shift in the trajectory toward your objective."

*Progress Update*: **Objective Progress: 85% - Victory within reach through cascading neutrality effects**

*Player Decision: So close! One more strategic message could secure victory.*

#### Message 5: Final Push (Optional - Victory Achieved Early!)
*Progress Assessment*: "**OBJECTIVE ACHIEVED!** The combination of Bismarck's economic focus, Wilhelm's family diplomacy, and Wilson's neutrality has created sufficient conditions to prevent World War I. The limited Austro-Serbian conflict burns out quickly due to lack of broader alliance participation."

**Final Result**: **Victory in 4 Messages** - Player achieved objective efficiently while adapting to both setbacks and successes

## Strategic Depth and Replayability

### Objective Categories
AI-generated objectives span multiple categories and complexity levels:

**Historical Prevention**: Stop major conflicts, disasters, or catastrophic events
- "Prevent World War II" - Contact Hitler's art teacher, Churchill in 1935, Roosevelt in 1939
- "Avert the Black Death" - Reach out to Byzantine traders, Mongol administrators, European physicians

**Acceleration Challenges**: Speed up human progress in key areas
- "Advance Medicine by 300 Years" - Contact Hippocrates, Ibn Sina, Pasteur, Fleming
- "Achieve Space Travel by 1800" - Message Galileo, Newton, Tsiolkovsky, early metallurgists

**Transformation Goals**: Reshape civilization fundamentally
- "Establish Global Democracy" - Contact Pericles, Magna Carta signers, John Locke, founding fathers
- "Create Peaceful World Religion" - Reach out to Buddha, Jesus, Muhammad, Gandhi

### Core Strategic Considerations
- **Temporal Synergy**: How changes in one era compound effects in another
- **Risk vs. Reward**: Balancing high-impact but dangerous approaches against safer strategies
- **Message Allocation**: Whether to focus all messages on one critical period or spread across time
- **Contingency Planning**: Adapting when early dice rolls don't go as expected

### Replayability Factors
- **AI-Generated Objectives**: Each game session features a unique historical goal created by the Objective Generator
- **Infinite Figure Combinations**: Countless ways to pair historical figures across different eras
- **Probabilistic Variation**: Identical strategies can succeed or fail based on dice outcomes
- **Strategic Discovery**: Players uncover new synergies and interactions between figures
- **Difficulty Emergence**: Challenge arises organically from objective complexity, historical resistance, and random outcomes

## Educational and Design Philosophy

### Learning Outcomes
- **Historical Empathy**: Understanding historical figures as complex, changeable human beings rather than static characters
- **Causal Thinking**: Appreciation for how small actions can have massive, unpredictable consequences
- **Strategic Communication**: Development of persuasive writing skills under strict constraints
- **Counterfactual Reasoning**: Exploration of alternate history and "what if" scenarios
- **Systems Thinking**: Recognition of interconnections between events across different time periods

### Content Approach
- **Character Authenticity**: Responses reflect documented personality traits while allowing for growth and change
- **Plausible Alternatives**: Timeline alterations explore realistic but untaken historical paths  
- **Educational Through Play**: Learning emerges from strategic thinking rather than rote memorization
- **Creative Interpretation**: Anachronistic or seemingly nonsensical messages can lead to unexpected insights
- **Narrative Coherence**: Even negative outcomes create logical, story-driven consequences

### Technical Design Principles
- **AI Collaboration**: Multiple specialized systems work together seamlessly to maintain consistency
- **Emergent Storytelling**: Focus on unique, player-driven experiences over scripted scenarios
- **Balanced Randomness**: Probability creates genuine uncertainty while maintaining strategic agency
- **Scalable Framework**: Core mechanics support future additions like modifiers, achievements, or expanded figure databases

## Narrative Framework

### The Communication Medium
The game deliberately maintains narrative ambiguity about how messages reach historical figures, allowing players to develop their own interpretation:

**Possible Interpretations**:
- **Divine/Mystical**: Messages appear as visions, dreams, or supernatural inspiration
- **Temporal Anomaly**: Unexplained phenomenon delivering messages via period-appropriate medium (letters, whispered advice, etc.)
- **Consciousness Interface**: Direct mental communication transcending temporal boundaries
- **Suspension of Disbelief**: Accept the premise like time travel in science fiction

### Authority and Attention
Historical figures respond to messages because:

**Demonstrated Insight**: Early messages prove their worth through accurate predictions or unknown information
**Personal Relevance**: Messages address the figure's deepest concerns, ambitions, or fears  
**Mysterious Authority**: Messages carry an inexplicable sense of importance or urgency
**Prophetic Quality**: Content suggests knowledge beyond normal human capability

### Conversation Context Architecture

#### Current System (Phase 3): Per-Figure Memory
Each historical figure maintains memory of previous exchanges within a single game session:
- Franz Ferdinand remembers your past warnings about Sarajevo
- Napoleon recalls your previous strategic advice
- Conversations build naturally within each relationship

#### Future Evolution (Phase 4): Global Timeline Awareness  
Historical figures will gain awareness of broader timeline changes:
- Franz Ferdinand might reference "troubling reports about shifting alliances" (from your messages to Bismarck)
- Cross-figure strategic coordination becomes possible
- Timeline coherence maintained through shared context

**Design Philosophy**: Balance historical authenticity with narrative engagement. Figures remain true to documented personalities while allowing for growth through player intervention.
