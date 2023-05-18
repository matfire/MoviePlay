import { atom } from "jotai";
import type { Models } from "appwrite";
const userAtom = atom<Models.Preferences | null>(null);

export default userAtom;
