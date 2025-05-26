import React from 'react';

interface FlaggedItem {
  id: string;
  title: string;
  type: string;
  flagType: string;
  reportsCount: number;
  dateReported: string;
  content: any;
  reports: any[];
}

interface FlaggedItemsTableProps {
  items: FlaggedItem[];
  onReview: (item: FlaggedItem) => void;
  loading: boolean;
}

const FlaggedItemsTable: React.FC<FlaggedItemsTableProps> = ({ items, onReview, loading }) => {
  return (
    <></>
  );
};

export default FlaggedItemsTable; 