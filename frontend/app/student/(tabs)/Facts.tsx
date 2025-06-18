import React, { useState, useCallback, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Animated, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';

interface Fact {
  id: number;
  category: Categories;
  title: string;
  fact: string;
  verified: boolean;
  source: string;
  year_discovered: number;
  interesting_rating: number;
}

enum Categories {
  PHYSICS = 'PHYSICS',
  HISTORY = 'HISTORY',
  ASTRONOMY = 'ASTRONOMY',
  BIOLOGY = 'BIOLOGY',
  ANIMALS = 'ANIMALS',
  TECHNOLOGY = 'TECHNOLOGY',
  GLOBAL_WARMING = 'GLOBAL_WARMING',
  SCIENCE = 'SCIENCE',
  SPACE = 'SPACE',
  NATURE = 'NATURE',
  MISCELLANEOUS = 'MISCELLANEOUS',
}

// Fallback facts data in case the API is down
const fallbackFacts: Fact[] = [
  {
    id: 1,
    category: Categories.SCIENCE,
    title: "Amazing Science Fact",
    fact: "A day on Venus is longer than its year. Venus takes 243 Earth days to rotate on its axis but only 225 Earth days to orbit the Sun.",
    verified: true,
    source: "NASA",
    year_discovered: 1960,
    interesting_rating: 9
  },
  {
    id: 2,
    category: Categories.ANIMALS,
    title: "Animal Kingdom",
    fact: "Honeybees can recognize human faces. They use the same method as humans to distinguish between different faces.",
    verified: true,
    source: "Scientific Research",
    year_discovered: 2005,
    interesting_rating: 8
  },
  {
    id: 3,
    category: Categories.TECHNOLOGY,
    title: "Tech Innovation",
    fact: "The first computer programmer was a woman. Ada Lovelace wrote the first algorithm intended to be processed by a machine in the 1840s.",
    verified: true,
    source: "Computer History",
    year_discovered: 1843,
    interesting_rating: 9
  },
  {
    id: 4,
    category: Categories.SPACE,
    title: "Space Exploration",
    fact: "There are more stars in the universe than grains of sand on all the beaches on Earth combined.",
    verified: true,
    source: "Astronomical Research",
    year_discovered: 2010,
    interesting_rating: 10
  },
  {
    id: 5,
    category: Categories.NATURE,
    title: "Natural Wonders",
    fact: "Trees can communicate with each other through underground fungal networks, sharing nutrients and information about threats.",
    verified: true,
    source: "Forest Research",
    year_discovered: 1997,
    interesting_rating: 9
  }
];

const categoryColors: Record<Categories, string> = {
  [Categories.PHYSICS]: 'text-teal-600',
  [Categories.HISTORY]: 'text-amber-800',
  [Categories.ASTRONOMY]: 'text-indigo-600',
  [Categories.BIOLOGY]: 'text-lime-700',
  [Categories.ANIMALS]: 'text-orange-500',
  [Categories.TECHNOLOGY]: 'text-fuchsia-700',
  [Categories.GLOBAL_WARMING]: 'text-red-700',
  [Categories.SCIENCE]: 'text-teal-600',
  [Categories.SPACE]: 'text-indigo-600',
  [Categories.NATURE]: 'text-lime-700',
  [Categories.MISCELLANEOUS]: 'text-gray-700', // Default color for unknown categories
};

const factTextColors: Record<Categories, { light: string; dark: string }> = {
  [Categories.PHYSICS]: { light: 'text-teal-700', dark: 'text-teal-200' },
  [Categories.HISTORY]: { light: 'text-amber-800', dark: 'text-amber-200' },
  [Categories.ASTRONOMY]: { light: 'text-indigo-700', dark: 'text-indigo-200' },
  [Categories.BIOLOGY]: { light: 'text-lime-700', dark: 'text-lime-200' },
  [Categories.ANIMALS]: { light: 'text-orange-700', dark: 'text-orange-100' },
  [Categories.TECHNOLOGY]: { light: 'text-fuchsia-700', dark: 'text-fuchsia-200' },
  [Categories.GLOBAL_WARMING]: { light: 'text-red-700', dark: 'text-red-200' },
  [Categories.SCIENCE]: { light: 'text-teal-700', dark: 'text-teal-200' },
  [Categories.SPACE]: { light: 'text-indigo-700', dark: 'text-indigo-200' },
  [Categories.NATURE]: { light: 'text-lime-700', dark: 'text-lime-200' },
  [Categories.MISCELLANEOUS]: { light: 'text-gray-700', dark: 'text-gray-200' }, // Default fact text color
};

const LoadingDots = ({ isDark }: { isDark: boolean }) => {
  const pulseAnim = useRef(new Animated.Value(0.3)).current; // Initial dim state

  useEffect(() => {
    const animatePulse = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1, // Brighter
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 0.3, // Dimmer
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    };

    animatePulse();

    return () => {
      pulseAnim.stopAnimation();
    };
  }, []);

  const dotColor = isDark ? 'bg-gray-400' : 'bg-gray-600';

  return (
    <View className="flex-row justify-center items-center py-2 space-x-2 mb-4">
      <Animated.View className={`w-3 h-3 rounded-full mr-2 ${dotColor}`} style={{ opacity: pulseAnim }} />
      <Animated.View className={`w-3 h-3 rounded-full mr-2 ${dotColor}`} style={{ opacity: pulseAnim }} />
      <Animated.View className={`w-3 h-3 rounded-full mr-2 ${dotColor}`} style={{ opacity: pulseAnim }} />
    </View>
  );
};

// FactItem component for individual fact animations
const FactItem = ({ fact, isDark, index }: { fact: Fact; isDark: boolean; index: number }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      delay: index * 100, // Staggered entry for new facts
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  const translateY = fadeAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  // Safely get category, fallback to MISCELLANEOUS if invalid
  const incomingCategoryString = typeof fact.category === 'string' ? fact.category.toUpperCase() : '';
  const currentCategory = Object.values(Categories).includes(incomingCategoryString as Categories)
    ? (incomingCategoryString as Categories)
    : Categories.MISCELLANEOUS;

  // Debugging logs
  console.log(`Fact ID: ${fact.id}, Incoming Category: ${fact.category}, Resolved Category: ${currentCategory}`);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ translateY }],
      }}
      className="mb-6"
    >
      <View className="flex-row items-start space-x-3">
        <View className={`w-2 h-2 rounded-full mt-2 ${isDark ? 'bg-indigo-400' : 'bg-indigo-500'}`} />
        <View
          className={`flex-1 rounded-2xl p-4 ${
            isDark ? 'bg-gray-800' : 'bg-white'
          } shadow-sm`}
        >
          <Text
            className={`text-sm font-pbold mb-2 ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}
          >
            Did You Know?
          </Text>
          <Text
            className={`text-xs font-pmedium mb-2 ${categoryColors[currentCategory]} ${isDark ? 'opacity-80' : 'opacity-100'}`}
          >
            {currentCategory.toUpperCase()}
          </Text>
          <Text
            className={`text-base font-pmedium ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}
          >
            {fact.fact}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

export default function Facts() {
  const currentTheme = useSelector((state: any) => state.theme.mode);
  const isDark = currentTheme === 'dark';
  const [facts, setFacts] = useState<Fact[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const isLoadingMore = useRef(false);

  const fetchFacts = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) {
      setRefreshing(true);
      setPage(1);
      setFacts([]);
    } else {
      setLoading(true);
      isLoadingMore.current = true;
    }
    setError(null);
    
    try {
      // Use fallback data directly for mobile compatibility
      const shuffledFacts = [...fallbackFacts].sort(() => Math.random() - 0.5);
      const selectedFacts = shuffledFacts.slice(0, 5);
      
      if (isRefreshing) {
        setFacts(selectedFacts);
      } else {
        setFacts(prev => {
          const newFacts = [...prev, ...selectedFacts];
          return newFacts;
        });
      }
      
      setHasMore(true);
      setPage(prev => prev + 1);
      
    } catch (err) {
      console.error('Error in fetchFacts:', err);
      setError('Failed to fetch facts. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
      isLoadingMore.current = false;
    }
  }, []);

  useEffect(() => {
    fetchFacts();
  }, []);

  const onRefresh = useCallback(() => {
    fetchFacts(true);
  }, [fetchFacts]);

  const handleScroll = useCallback((event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const paddingToBottom = 50; 
    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;

    if (isCloseToBottom && !loading && !refreshing && hasMore && !isLoadingMore.current) {
      fetchFacts();
    }
  }, [loading, refreshing, hasMore, fetchFacts]);

  return (
    <SafeAreaView className={`flex-1 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <View className="px-4 py-4 flex-row justify-between items-center">
        <Text className={`text-2xl font-pbold ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Facts
        </Text>
        <TouchableOpacity
          onPress={onRefresh}
          disabled={loading || refreshing}
          className={`flex-row items-center px-4 py-2 rounded-xl ${
            loading || refreshing
              ? 'bg-gray-400'
              : isDark
              ? 'bg-indigo-600'
              : 'bg-indigo-500'
          }`}
        >
          {loading || refreshing ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Ionicons name="refresh" size={20} color="white" />
              <Text className="text-white font-pmedium ml-2">Refresh</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Facts Container */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4 mb-8"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={isDark ? '#6366F1' : '#4F46E5'}
          />
        }
      >
        {error ? (
          <View className="items-center justify-center py-8">
            <Ionicons
              name="alert-circle"
              size={48}
              color={isDark ? '#EF4444' : '#DC2626'}
            />
            <Text
              className={`text-center mt-4 font-pmedium ${
                isDark ? 'text-red-400' : 'text-red-600'
              }`}
            >
              {error}
            </Text>
          </View>
        ) : (
          <>
            {facts.length > 0 && facts.map((fact, index) => (
              <FactItem key={index} fact={fact} isDark={isDark} index={index} />
            ))}
            
            {loading && !refreshing && (
              <LoadingDots isDark={isDark} />
            )}

            {!loading && !refreshing && facts.length === 0 && (
              <View className="items-center justify-center py-16">
                <Ionicons
                  name="bulb-outline"
                  size={64}
                  color={isDark ? '#6366F1' : '#4F46E5'}
                />
                <Text
                  className={`text-center mt-4 font-pmedium text-lg ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  Pull down to refresh and discover interesting facts!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
