export type GamePhase = {
  id?: string; // برای new item id نداره
  title: string;
  description: string;
  rewardPoints: number;
  duration: number; // این لازمه
  isActive: boolean;
  createdAt?: Date; // فقط در دیتابیس/بک‌اند میاد
};
