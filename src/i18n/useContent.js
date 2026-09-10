import { useCallback } from 'react';
import { useLanguage } from './LanguageContext.jsx';
import { getContentTranslation, getMilestoneTranslation } from './content/priorityAreas.js';

/**
 * Hook for translating dynamic content from chip-data.json.
 * 
 * This hook provides functions to get translated versions of priority area
 * content. It automatically falls back to English if no translation exists.
 * 
 * Usage:
 *   const { translatePriority, translateMilestone } = useContent();
 *   
 *   // Get translated goal
 *   const goal = translatePriority(priority.id, 'goal', priority.goal);
 *   
 *   // Get translated milestone description
 *   const desc = translateMilestone(priority.id, milestone.id, milestone.description);
 */
export function useContent() {
  const { language } = useLanguage();

  /**
   * Translate a priority area field.
   * 
   * @param {string} priorityId - Priority area ID (e.g., 'nutrition-security')
   * @param {string} field - Field path (e.g., 'goal', 'objective.description')
   * @param {*} fallback - Original English value
   * @returns {*} Translated value or fallback
   */
  const translatePriority = useCallback((priorityId, field, fallback) => {
    return getContentTranslation(language, priorityId, field, fallback);
  }, [language]);

  /**
   * Translate a milestone description.
   * 
   * @param {string} priorityId - Priority area ID
   * @param {string} milestoneId - Milestone ID
   * @param {string} fallback - Original description
   * @returns {string} Translated description or fallback
   */
  const translateMilestone = useCallback((priorityId, milestoneId, fallback) => {
    return getMilestoneTranslation(language, priorityId, milestoneId, fallback);
  }, [language]);

  /**
   * Get a translated priority area object with common fields translated.
   * This is a convenience function that returns a new object with translated fields.
   * 
   * @param {Object} priority - Original priority area object
   * @returns {Object} Priority with translated fields
   */
  const getTranslatedPriority = useCallback((priority) => {
    if (!priority) return priority;
    
    return {
      ...priority,
      domain: translatePriority(priority.id, 'domain', priority.domain),
      priority: translatePriority(priority.id, 'priority', priority.priority),
      goal: translatePriority(priority.id, 'goal', priority.goal),
      disparityAddressed: translatePriority(priority.id, 'disparityAddressed', priority.disparityAddressed),
      evidenceBasedStrategy: translatePriority(priority.id, 'evidenceBasedStrategy', priority.evidenceBasedStrategy),
      outcome: translatePriority(priority.id, 'outcome', priority.outcome),
      objective: {
        ...priority.objective,
        description: translatePriority(priority.id, 'objective.description', priority.objective.description),
        metric: translatePriority(priority.id, 'objective.metric', priority.objective.metric),
      },
      milestones: priority.milestones.map(m => ({
        ...m,
        description: translateMilestone(priority.id, m.id, m.description),
      })),
    };
  }, [translatePriority, translateMilestone]);

  return {
    translatePriority,
    translateMilestone,
    getTranslatedPriority,
    language,
  };
}
