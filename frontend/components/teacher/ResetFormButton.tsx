import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ResetFormButtonProps {
  onResetConfirm: () => void;
  isVisible?: boolean;
  onClose?: () => void;
  disabled?: boolean;
}

const ResetFormButton = ({ onResetConfirm, isVisible = false, onClose, disabled = false }: ResetFormButtonProps) => {
  const [showConfirmModalInternal, setShowConfirmModalInternal] = useState(false);
  const showConfirmModal = isVisible || showConfirmModalInternal;

  useEffect(() => {
    if (isVisible && !showConfirmModalInternal) {
      setShowConfirmModalInternal(true);
    } else if (!isVisible && showConfirmModalInternal) {
      setShowConfirmModalInternal(false);
    }
  }, [isVisible]);

  const handlePress = () => {
    if (!isVisible) {
      setShowConfirmModalInternal(true);
    }
  };

  const handleConfirm = () => {
    onResetConfirm();
    if (onClose) onClose();
    else setShowConfirmModalInternal(false);
  };

  const handleCancel = () => {
    if (onClose) onClose();
    else setShowConfirmModalInternal(false);
  };

  return (
    <View>
      {!isVisible && (
        <Pressable
          className="p-1.5 rounded-lg active:opacity-80"
          onPress={handlePress}
          android_ripple={{ color: '#e0e7ff', borderless: true }}
          disabled={disabled}
        >
          <Ionicons name="refresh-outline" size={24} color="#f97316" />
        </Pressable>
      )}

      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-xl p-6 w-full max-w-[400px]">
            <Text className="text-lg font-psemibold text-slate-800 mb-2 text-center">
              Reset Form?
            </Text>
            <Text className="text-base text-slate-500 mb-6 text-center">
              Are you sure you want to reset the form? Your unsaved changes will be lost.
            </Text>

            <View className="flex-col space-y-4">
              <Pressable
                className="w-full bg-slate-100 px-6 py-3 rounded-lg"
                onPress={handleCancel}>
                <Text className="text-slate-600 font-pmedium text-center text-base">
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                className="w-full bg-red-100 px-6 py-3 rounded-lg"
                onPress={handleConfirm}>
                <Text className="text-red-600 font-pmedium text-center text-base">
                  Reset
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ResetFormButton; 