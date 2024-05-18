export type Group = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  isAdmin: boolean;
  adminId: string;
};

export type GroupChat = {
  id: string;
  messages: Message[];
};

export type User = {
  id: string;
  userName: string;
  profileImagePath: string;
};

export type Contact = {
  id: string;
  user: User;
};

export type Notification = {
  id: string;
  message: string;
  date: Date;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  user: User;
};

export type Invitation = {
  url: string;
  expirationDate: string;
};

export type InvitationPage = {
  team: Group;
  invitation: Invitation;
};

export type Account = {
  user: User | null;
  token: string;
};
export type Refund = {
  amount: number;
  isAmountSpecified: boolean;
  user: User;
  dateOfRefund: Date | null;
  status: string;
  paymentMethod: string;
};
export type Expense = {
  id: string;
  date: Date;
  title: string;
  amount: number;
  category: string;
  filePath: string | null;
  isGlobalExpense: boolean;
  isRefunded: boolean;
  refunds: Refund[];
  payer: User;
  payee: User[] | null;
  team: Group;
};

export type Statistic = {
  category: string;
  totalAmount: number;
  averageAmount: number;
  count: number;
  percentageOfTotal: number;
};
