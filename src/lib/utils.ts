export const generateTicketNumber = (): string => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let randomLetters = '';
  for (let i = 0; i < 3; i++) {
    randomLetters += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  
  const randomNumbers = Math.floor(100 + Math.random() * 900).toString(); // 3 digit
  
  return `${randomLetters}${randomNumbers}`;
};

export const formatCurrency = (amount: number): string => {
  return `RM${amount.toFixed(2)}`;
};
