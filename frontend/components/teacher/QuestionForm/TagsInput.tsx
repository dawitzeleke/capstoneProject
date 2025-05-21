import React, { useState } from "react";
import { View, TextInput, Pressable, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  error?: boolean;
  submitted?: boolean;
  loading?: boolean;
  maxLength?: number;
}

const TagsInput = ({ 
  value = [], 
  onChange, 
  placeholder, 
  error = false,
  submitted = false,
  loading = false,
  maxLength = 20 
}: TagsInputProps) => {
  const [inputText, setInputText] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const validateTag = (tag: string) => {
    if (tag.length > maxLength) {
      throw `Tag cannot exceed ${maxLength} characters`;
    }
    if (value.includes(tag)) {
      throw "Duplicate tag";
    }
    if (!/^[a-zA-Z0-9\-_ ]+$/.test(tag)) {
      throw "Invalid characters";
    }
    return true;
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    setLocalError(null);

    if (/[ ,\n]/.test(text)) {
      try {
        const newTags = text
          .split(/[ ,\n]+/)
          .map(tag => tag.trim())
          .filter(tag => {
            if (!tag) return false;
            validateTag(tag);
            return true;
          });
          
        onChange([...value, ...newTags]);
        setInputText("");
      } catch (err) {
        setLocalError(err as string);
        setTimeout(() => setLocalError(null), 3000);
      }
    }
  };

  const removeTag = (index: number) => {
    if (!loading) onChange(value.filter((_, i) => i !== index));
  };

  return (
    <View className="bg-white rounded-xl shadow p-4 mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-psemibold text-slate-800">
          Tags<Text className="text-red-500"> *</Text>
        </Text>
        {loading && <ActivityIndicator size="small" color="#4F46E5" />}
      </View>

      <View className="flex-row items-center justify-between">
        <TextInput
          placeholder={placeholder || "Add tags separated by space/comma"}
          placeholderTextColor="#94a3b8"
          className={`flex-1 border-b text-sm py-1 ${
            (submitted && error) || localError
              ? "border-red-200 bg-red-50 rounded" 
              : "border-slate-200 text-black font-pregular"
          }`}
          value={inputText}
          onChangeText={handleInputChange}
          editable={!loading}
        />
      </View>

      {(localError || (submitted && error)) && (
        <Text className="text-red-500 text-sm mt-2 font-pregular">
          {localError || "At least one tag required"}
        </Text>
      )}

      <View className="flex-row flex-wrap gap-2 mt-3">
        {value.map((tag, index) => (
          <View
            key={index}
            className="bg-indigo-100 px-3 py-1 rounded-full flex-row items-center"
          >
            <Text 
              className="text-indigo-700 font-pregular text-sm mr-1 max-w-[100px]" 
              numberOfLines={1} 
              ellipsizeMode="tail"
            >
              {tag}
            </Text>
            <Pressable 
              onPress={() => removeTag(index)}
              disabled={loading}
            >
              <Ionicons 
                name="close-circle" 
                size={14} 
                color={loading ? "#94a3b8" : "#4F46E5"} 
              />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TagsInput;