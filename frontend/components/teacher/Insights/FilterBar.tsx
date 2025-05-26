import React from 'react';
import { View, useWindowDimensions } from 'react-native';
import DateRangeFilter from './DateRangeFilter';
import ContentTypeFilter from './ContentTypeFilter';
import RefreshButton from './RefreshButton';

interface FilterBarProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  contentTypes: ('question' | 'image' | 'video')[];
  onContentTypeChange: (type: 'question' | 'image' | 'video') => void;
  onRefresh: () => void;
  loading: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  dateRange,
  onDateRangeChange,
  contentTypes,
  onContentTypeChange,
  onRefresh,
  loading,
}) => {
  const { width } = useWindowDimensions();
  const isSmall = width <= 425;

  return (
    <View
      style={{ zIndex: 200 }}
      className={
        `my-4 w-full flex ${
          isSmall ? 'flex-col space-y-2' : 'flex-row items-center space-x-4'
        }`
      }
    >
      {/* Filters */}
      <View
        className={
          `flex flex-wrap ${
            isSmall ? 'flex-col space-y-2' : 'flex-row space-x-2'
          }`
        }
      >
        <DateRangeFilter
          currentRange={dateRange}
          onSelectRange={onDateRangeChange}
        />
        <ContentTypeFilter
          selectedTypes={contentTypes}
          onSelectType={onContentTypeChange}
        />
      </View>

    </View>
  );
};

export default FilterBar;
