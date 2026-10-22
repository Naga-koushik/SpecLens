import { Phone } from '../../types/index.js';

export interface AssistantContext { text: string; sources: string[]; }
const fields = [
  ['brand', (phone: Phone) => phone.brand], ['name', (phone: Phone) => phone.name],
  ['display', (phone: Phone) => [phone.display?.size, phone.display?.type, phone.display?.refreshRate].filter(Boolean).join(', ')],
  ['battery', (phone: Phone) => phone.battery?.capacity], ['chipset', (phone: Phone) => phone.processor?.chipset],
  ['ram', (phone: Phone) => phone.memory?.ramOptions], ['storage', (phone: Phone) => phone.storage?.storageOptions],
  ['weight', (phone: Phone) => phone.weight], ['charging', (phone: Phone) => phone.charging],
  ['os', (phone: Phone) => phone.operatingSystem], ['price', (phone: Phone) => phone.price?.raw]
] as const;

export function buildAssistantContext(phones: Phone[], maxCharacters = 7000): AssistantContext {
  const sources: string[] = []; const blocks: string[] = [];
  phones.forEach((phone) => {
    const lines = fields.map(([field, getter]) => `${field}: ${getter(phone) || 'not available'}`);
    fields.forEach(([field]) => { if (!sources.includes(field)) sources.push(field); });
    blocks.push(`PHONE ${phone.id} BEGIN\n${lines.join('\n')}\nPHONE ${phone.id} END`);
  });
  return { text: blocks.join('\n\n').slice(0, maxCharacters), sources };
}
