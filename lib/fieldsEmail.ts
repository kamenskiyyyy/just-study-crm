export const fieldsEmail = (name: string, value: string) => {
  return `
      <div style='display: flex; gap: 8px'>
        <p>${name}:</p>
        <p>${value}</p>
      </div>
  `;
};
