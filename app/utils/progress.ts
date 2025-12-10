/**
 * Calculates progress percentage based on step weights
 * Flexible system that adapts to new steps being added
 */

// Вес каждого шага (важность/время выполнения)
const stepWeights: Record<number, number> = {
  // ПЕРВАЯ ПОЛОВИНА КВИЗА (1-12) = ~50%
  1: 1,   // Reviews (quick social proof) 
  2: 2,   // Age (simple input)
  3: 2,   // BeforeStart (reading/explanation)  
  4: 2,   // Name (personalization)
  5: 2,   // PersonalPlan (expectation setting)
  6: 4,   // Feelings (main content, multiple inputs)
  7: 3,   // Pace (important choice)
  8: 1,   // ProgressTestimonial (quick reinforcement)
  9: 4,   // MainGoal (core question, important)
  10: 3,  // Overall (important assessment)
  11: 1,  // DoingAmazing (quick encouragement)
  12: 2,  // SleepTrouble (simple yes/no) - СЕРЕДИНА ПУТИ
  
  // ВТОРАЯ ПОЛОВИНА КВИЗА (13-32) = ~50%
  13: 2,  // Nightmares (simple yes/no)
  14: 2,  // SupportSystem (simple yes/no)
  15: 2,  // WhyAvocado (info about AI companion)
  16: 2,  // Medications (yes/no with optional input)
  17: 2,  // TherapyHistory (single select)
  18: 2,  // MedicalConditions (yes/no with optional input)
  19: 2,  // PsychiatricConditions (yes/no with optional input)
  20: 2,  // PsychologyBooks (simple yes/no)
  21: 2,  // FamilyTherapy (simple yes/no)
  22: 2,  // SocialGroups (simple yes/no)
  23: 4,  // Goals (multiple selection + custom input)
  24: 2,  // Community (social proof)
  25: 3,  // Customization (slider choice)
  26: 3,  // BeforeAfter (comparison)
  27: 3,  // Time selection
  28: 2,  // Results (82% - encouragement with stats)
  29: 2,  // Commitment (tap & hold interaction)
  30: 2,  // Email capture
  31: 3,  // Personalizing (final processing)
  32: 1,  // Final (placeholder for future)
};

export const getProgressPercentage = (step: number): number => {
  // Находим максимальный известный шаг (32 для полного пути)
  const maxKnownStep = 32;
  
  // Рассчитываем общий вес всех шагов (1-24)
  const totalWeight = Object.keys(stepWeights)
    .map(Number)
    .filter(s => s <= maxKnownStep)
    .reduce((sum, s) => sum + (stepWeights[s] || 1), 0);

  // Рассчитываем накопленный вес до текущего шага
  const cumulativeWeight = Object.keys(stepWeights)
    .map(Number)
    .filter(s => s <= step)
    .reduce((sum, s) => sum + (stepWeights[s] || 1), 0);

  // Возвращаем процент
  const percentage = (cumulativeWeight / totalWeight) * 100;
  return Math.min(percentage, 100);
};

/**
 * Helper function to add weight for new steps
 * Usage: addStepWeight(13, 3) adds step 13 with weight 3
 */
export const addStepWeight = (step: number, weight: number) => {
  stepWeights[step] = weight;
};