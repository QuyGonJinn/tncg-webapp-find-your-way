// Hinweise die während des Spiels angezeigt werden
// threshold: Anzahl der abgeschlossenen Stationen, ab der dieser Hinweis angezeigt wird
// text: Der Hinweistext

export const HINTS = [
  { threshold: 0,  text: "Ihr seid am Start – los geht's! Sucht zuerst die einfachsten Stationen." },
  { threshold: 3,  text: "Gut gemacht! Tipp: Aktive Stationen bringen mehr Punkte – traut euch!" },
  { threshold: 6,  text: "Halbzeit! Schaut, welche Stationen noch offen sind und plant eure Route." },
  { threshold: 9,  text: "Fast geschafft! Nur noch wenige Stationen – gebt alles!" },
  { threshold: 11, text: "Unglaublich! Noch eine Station – ihr seid echte Champions!" },
];
