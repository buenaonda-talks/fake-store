import { useEffect, useState } from "react";

const LOCAL_STORAGE_KEY = "credits";

type CreditsItem = {
  credits: number;
};

const getCredits = (): CreditsItem => {
  const credits = localStorage.getItem(LOCAL_STORAGE_KEY);
  return credits
    ? JSON.parse(credits)
    : {
        credits: 0,
      };
};

const addCredits = (credits: number) => {
  const creditsItem = getCredits();

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      credits: creditsItem.credits + credits,
    })
  );
};

const substractFromCredits = (credits: number) => {
  const creditsItem = getCredits();

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify({
      credits: creditsItem.credits - credits,
    })
  );
};

const PrincipalCreditsService = {
  getCredits,
  addCredits,
  substractFromCredits,
};

export const useCredits = () => {
  const [credits, setCredits] = useState<CreditsItem>(
    PrincipalCreditsService.getCredits()
  );

  useEffect(() => {
    setCredits(PrincipalCreditsService.getCredits());
  }, []);

  const addCredits = (credits: number) => {
    PrincipalCreditsService.addCredits(credits);
    setCredits(PrincipalCreditsService.getCredits());
  };

  const substractFromCredits = (credits: number) => {
    PrincipalCreditsService.substractFromCredits(credits);
    setCredits(PrincipalCreditsService.getCredits());
  };

  return {
    credits,
    CreditsService: {
      addCredits,
      substractFromCredits,
    },
  };
};
