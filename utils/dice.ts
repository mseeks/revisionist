export enum DiceOutcome {
    CRITICAL_FAILURE = 'Critical Failure',
    FAILURE = 'Failure',
    NEUTRAL = 'Neutral',
    SUCCESS = 'Success',
    CRITICAL_SUCCESS = 'Critical Success'
}

export interface DiceResult {
    roll: number
    outcome: DiceOutcome
}

/**
 * Rolls a D20 and returns both the roll value and outcome category
 * @returns DiceResult with roll (1-20) and categorized outcome
 */
export function rollD20(): DiceResult {
    const roll = Math.floor(Math.random() * 20) + 1

    let outcome: DiceOutcome

    if (roll >= 1 && roll <= 2) {
        outcome = DiceOutcome.CRITICAL_FAILURE
    } else if (roll >= 3 && roll <= 7) {
        outcome = DiceOutcome.FAILURE
    } else if (roll >= 8 && roll <= 13) {
        outcome = DiceOutcome.NEUTRAL
    } else if (roll >= 14 && roll <= 18) {
        outcome = DiceOutcome.SUCCESS
    } else { // roll >= 19 && roll <= 20
        outcome = DiceOutcome.CRITICAL_SUCCESS
    }

    return {
        roll,
        outcome
    }
}

/**
 * Categorizes a dice roll into outcome tier (useful for testing)
 * @param roll The dice roll value (1-20)
 * @returns The outcome category
 */
export function categorizeRoll(roll: number): DiceOutcome {
    if (roll >= 1 && roll <= 2) {
        return DiceOutcome.CRITICAL_FAILURE
    } else if (roll >= 3 && roll <= 7) {
        return DiceOutcome.FAILURE
    } else if (roll >= 8 && roll <= 13) {
        return DiceOutcome.NEUTRAL
    } else if (roll >= 14 && roll <= 18) {
        return DiceOutcome.SUCCESS
    } else { // roll >= 19 && roll <= 20
        return DiceOutcome.CRITICAL_SUCCESS
    }
}
