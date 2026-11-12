import { useEffect, useState } from 'react';
import { initializeAnalytics } from '../../lib/analytics';
import './AnalyticsConsent.scss';

type ConsentChoice = 'accepted' | 'rejected' | null;
const CONSENT_STORAGE_KEY = 'quickqr-analytics-consent';

function readConsentChoice(): ConsentChoice {
  try {
    const choice = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return choice === 'accepted' || choice === 'rejected' ? choice : null;
  } catch (error) {
    console.error('Unable to read analytics consent from local storage.', error);
    return null;
  }
}

export const AnalyticsConsent: React.FC = () => {
  const [consent, setConsent] = useState<ConsentChoice>(readConsentChoice);

  useEffect(() => {
    if (consent === 'accepted') initializeAnalytics();
  }, [consent]);

  const chooseConsent = (choice: Exclude<ConsentChoice, null>) => {
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch (error) {
      console.error('Unable to save analytics consent to local storage.', error);
    }

    setConsent(choice);
  };

  if (consent !== null) return null;

  return (
    <aside className="analytics-consent" aria-label="Analytics cookie consent">
      <p className="analytics-consent__message">
        We use Google Analytics to understand site visits. Analytics cookies are optional and will only be enabled with your consent.
      </p>
      <div className="analytics-consent__actions">
        <button
          type="button"
          className="analytics-consent__button analytics-consent__button--accept"
          onClick={() => chooseConsent('accepted')}
        >
          Accept
        </button>
        <button
          type="button"
          className="analytics-consent__button analytics-consent__button--reject"
          onClick={() => chooseConsent('rejected')}
        >
          Reject
        </button>
      </div>
    </aside>
  );
};
