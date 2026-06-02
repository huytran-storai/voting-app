# Voting App

## Deploy lên Vercel (thủ công)

Mỗi lần push code xong, chạy 2 lệnh sau để rebuild Vercel:

```bash
git add .
git commit -m "your message"
git push origin master
npx vercel --prod
```

> Lệnh `npx vercel --prod` sẽ build và deploy lên production tự động.
> URL production: **https://voting-app-seven-jet.vercel.app**

---

## Chạy local

```bash
npm install
npm start
```

App chạy tại: http://localhost:4200
