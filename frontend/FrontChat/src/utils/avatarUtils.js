export const AVATAR_COLORS = [
  "#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626", "#9333ea"
];

/**
 * Generates a color from the AVATAR_COLORS palette based on the given name.
 * @param {string} name 
 * @returns {string} hex color
 */
export function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let n = 0;
  for (let i = 0; i < name.length; i++) n += name.charCodeAt(i);
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

/**
 * Returns the initials of a name (up to 2 characters).
 * @param {string} name 
 * @returns {string} initials
 */
export function getInitials(name) {
  if (!name) return "";
  return name
    .split(" ")
    .map(w => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
