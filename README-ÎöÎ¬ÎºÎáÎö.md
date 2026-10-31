# The Daily Challenge: התקנה עצמאית (GitHub Pages + Firebase)

האתר יעבוד מכל טלפון, טאבלט או מחשב, בלי צורך בחשבון Claude.
ההגדרה נעשית פעם אחת בלבד ולוקחת כ־20 דקות.

## חלק א׳: Firebase (המקום שבו נשמרים הנתונים)

1. נכנסים ל־https://console.firebase.google.com עם חשבון Google ולוחצים **Create a project** (לדוגמה: `daily-challenge`).
   את Google Analytics אפשר לכבות.
2. **מסד הנתונים:** בתפריט בוחרים **Build → Firestore Database → Create database**.
   - מיקום: `eur3 (europe-west)`.
   - מצב: **Production mode**.
3. **כללי גישה:** בלשונית **Rules** של Firestore מוחקים את מה שכתוב, מדביקים את התוכן של הקובץ `firestore.rules` ולוחצים **Publish**.
4. **התחברות אנונימית:** בוחרים **Build → Authentication → Get started**. בלשונית **Sign-in method** בוחרים **Anonymous**, מפעילים (Enable) ושומרים.
5. **רישום האתר:** לוחצים על גלגל השיניים → **Project settings**. למטה, תחת **Your apps**, לוחצים על הסמל `</>` (Web).
   - נותנים שם כלשהו.
   - **לא** מסמנים Firebase Hosting.
   - לוחצים **Register app**.
6. **פרטי החיבור:** מופיע קטע קוד עם `const firebaseConfig = { ... }`.
   - מעתיקים את הערכים (apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId).
   - מדביקים אותם בקובץ `firebase-config.js`, במקום המילים `PASTE...`, ושומרים.

## חלק ב׳: GitHub Pages (המקום שבו האתר יושב)

1. נכנסים ל־https://github.com, פותחים חשבון אם אין, ולוחצים **New repository**.
   - שם: `daily-challenge`.
   - סוג: **Public**.
   - לוחצים **Create repository**.
2. **העלאת הקבצים:** לוחצים על הקישור **uploading an existing file** וגוררים לחלון את **כל** הקבצים מהתיקייה, כולל שתי התמונות avatar-aya.jpg ו-avatar-yousef.jpg.
   ודאו שהעליתם את `firebase-config.js` המעודכן. לוחצים **Commit changes**.
3. **הפעלת האתר:** נכנסים ל־**Settings → Pages**.
   - תחת **Branch** בוחרים `main` ו־`/ (root)`.
   - לוחצים **Save**.
4. אחרי דקה־שתיים האתר זמין בכתובת:
   `https://<שם-המשתמש-שלכם>.github.io/daily-challenge/`

## מה קורה בכניסה הראשונה

- הגדרות הילדים נוצרות אוטומטית: הקודים, הצבעים והתמונות.
- קודים: איה `4817`, יוסף `3952`, הורה `736251`.
- אפשר לשנות את הקודים בלשונית **Settings** באזור ההורים.
- משימות השבוע (1–7 בנובמבר) כבר כלולות בקובץ `missions.js`.

## משימות לשבועות הבאים

מבקשים מ־Claude ליצור משימות. מקבלים ממנו טקסט JSON, ומדביקים אותו באזור ההורים בלשונית **Import / Export**.
אין צורך לגעת שוב ב־GitHub.

## אבטחה: מה כדאי לדעת

- **מי יכול להיכנס:** כל מי שיש לו את הקישור יכול לפתוח את האתר. לכן שולחים אותו רק לילדים.
- **מה מגן על הנתונים:** משחק בשם ילד דורש את הקוד שלו, ואזור ההורים דורש את קוד ההורה.
- **הגבלה:** זו הגנה משפחתית פשוטה ולא אבטחה ברמה גבוהה. מי שמבין בתכנות ויש לו את הקישור יכול באופן תיאורטי לקרוא את הנתונים. אין באתר מידע רגיש מעבר לשמות, ניקוד וקודי משחק.
- **עלות:** השימוש המשפחתי נשאר בתוך המסלול החינמי של Firebase (מסלול Spark).
