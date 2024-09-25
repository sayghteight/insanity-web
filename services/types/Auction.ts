export interface Auction {
    bids: any;
    startBid: ReactNode;
    currentBid: any;
    timeLeft: string;
    dateEnd(dateEnd: any): unknown;
    id: string;
    title: string;
    description?: string;
    startDate?: string;
    endDate?: string;
}
  