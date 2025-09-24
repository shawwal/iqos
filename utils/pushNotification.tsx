// @ts-nocheck
// Can use this function below or use Expo's Push Notification Tool from: https://expo.dev/notifications
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function sendPushNotificationSample(expoPushToken) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Original Title',
    body: 'And here is the body!',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

export async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      // alert('Failed to get push token for push notification!');
      return;
    }
    try {
      token = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig.extra.eas.projectId,
      });
      // console.log('Expo push token:', token);
    } catch (error) {
      // console.error('Error getting push token:', error);
    }
  } else {
    // alert('Must use physical device for Push Notifications');
  }

  return token?.data;
}

export async function schedulePushNotification(timeToSchedule, notificationTitle, notificationMassage) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: notificationTitle,
      body: notificationMassage,
      // data: { data: "goes here" },
    },
    trigger: { seconds: timeToSchedule },
  });
}

export async function sendPushNotification(
  expoPushToken: string,
  messageContent: string,
  messageSender: string,
  userId: string,
  chatId: string,
  friendId: string,
  isGroup: boolean,
  groupName: string, // Add group name parameter
  avatarUrl: string,
  recipientId: string,
) {
  // Regular expressions to match image and video patterns
  const imagePattern = /^\[Image:.*\]$/i;
  const videoPattern = /^\[Video:.*\]$/i;

  let notificationBody = messageContent;
  let isMediaOnly = false;
  let mediaType = '';

  if (imagePattern.test(messageContent)) {
    isMediaOnly = true;
    mediaType = 'Image';
  } else if (videoPattern.test(messageContent)) {
    isMediaOnly = true;
    mediaType = 'Video';
  } else {
    // Check if the message starts with image/video pattern followed by text
    const imageWithTextPattern = /^\[Image:.*\]\s+(.+)$/i;
    const videoWithTextPattern = /^\[Video:.*\]\s+(.+)$/i;

    const imageWithTextMatch = messageContent.match(imageWithTextPattern);
    const videoWithTextMatch = messageContent.match(videoWithTextPattern);

    if (imageWithTextMatch) {
      isMediaOnly = false;
      mediaType = 'Image';
      const additionalText = imageWithTextMatch[1];
      notificationBody = `${messageSender} commented on an ${mediaType}`;
    } else if (videoWithTextMatch) {
      isMediaOnly = false;
      mediaType = 'Video';
      const additionalText = videoWithTextMatch[1];
      notificationBody = `${messageSender} commented on a ${mediaType}`;
    }
  }

  if (isMediaOnly) {
    if (isGroup) {
      // notificationBody = `${messageSender} shared a new ${mediaType} in ${groupName}`;
      notificationBody = `New ${mediaType} shared with you!`;
    } else {
      notificationBody = `New ${mediaType} shared with you!`;
    }
  }

  // Construct the message object for Expo Push Notification
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: messageSender || '',
    body: notificationBody,
    data: {
      "chat_id": chatId,
      "user_id": userId,
      "friend_id": friendId,
      "user_name": messageSender.toString(),
      "is_group": isGroup,
      "avatar_url": avatarUrl
    },
  };

  try {
    // Send the push notification
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    if (!response.ok) {
      console.error('Failed to send push notification:', response.statusText);
    }
  } catch (error) {
    console.error('Error sending push notification:', error);
  }

  // console.log('userId', userId);
  // console.log('chatId', chatId);
  // console.log('friendId', friendId);
  // Check if UUID fields are valid
  if (!userId || !chatId) {
    console.error('Invalid UUID for user_id, chat_id');
    return;
  }

  // Insert notification into Supabase
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId || null, // Replace empty strings with null if needed
      chat_id: chatId || null,
      friend_id: friendId || null,
      title: messageSender || '',
      message: notificationBody,
      is_group: isGroup || false,
      avatar_url: avatarUrl || '',
      recipient_id: friendId || null
    });

  if (error) {
    console.error('Error inserting notification into Supabase:', error.message);
  }
}

const getGroupMembersPushTokens = async (chatId: string, currentUserId: string) => {
  try {
    // Fetch all group members' user_ids excluding the current user
    const { data: groupMembers, error: groupError } = await supabase
      .from('chat_members')
      .select('user_id')
      .eq('chat_id', chatId)
      .neq('user_id', currentUserId); // Exclude the current user

    if (groupError) {
      console.error('Error fetching group members:', groupError);
      return [];
    }

    const groupMemberIds = groupMembers.map((member: any) => member.user_id);

    const { data: usersProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('expo_push_token')
      .in('id', groupMemberIds);

    if (profilesError) {
      console.error('Error fetching profiles of group members:', profilesError);
      return [];
    }

    // Map the profiles to expo_push_token, filter out any falsy values,
    // then remove duplicates by converting to a Set and back to an array.
    const tokens = usersProfiles
      ?.map((profile: any) => profile.expo_push_token)
      .filter((token: string) => !!token) || [];
    const uniqueTokens = [...new Set(tokens)];
    return uniqueTokens;
  } catch (error) {
    console.error('Error getting group members push tokens:', error);
    return [];
  }
};

const getFriendPushToken = async (friendId: string) => {
  try {
    const { data: usersProfiles, error } = await supabase
      .from('profiles')
      .select('expo_push_token')
      .eq('id', friendId);

    if (error) {
      console.error('Error fetching profiles of users:', error);
      return [];
    }

    return usersProfiles?.map((profile: any) => profile.expo_push_token).filter((token: string) => !!token) || [];
  } catch (error) {
    console.error('Error getting friend push token:', error);
    return [];
  }
};


export const sendPushNotificationsToOtherUsers = async (messageContent: any, params: any, userData: any) => {
  try {
    let pushTokens: string[] = [];
    // Default notification title for direct chats
    let notificationTitle = userData?.username || userData?.email;

    if (params.isGroup === "true") {
      pushTokens = await getGroupMembersPushTokens(params.chat_id, userData.id);
      // console.log('pushTokens', pushTokens)
      // Update the notification title to include the group name
      notificationTitle = `${userData?.username || userData?.email} in ${params.name}`;
      // console.log('messageContent', messageContent)
    } else {
      pushTokens = await getFriendPushToken(params.friend_id);
    }

    for (const token of pushTokens) {
      await sendPushNotification(
        token,
        messageContent,
        notificationTitle,
        userData.id,
        params.chat_id,
        params.friend_id,
        params.isGroup,
        params.name,
        userData.avatar_url
      );
    }
  } catch (error) {
    console.error('Error sending push notifications to other users:', error);
  }
};

export const savePushToken = async (userId: string) => {
  try {
    const newPushToken = await registerForPushNotificationsAsync();
    if (!newPushToken) {
      // console.error('Failed to retrieve push token');
      return;
    }
    
    // Fetch current token from DB
    const { data: currentData, error: fetchError } = await supabase
      .from('profiles')
      .select('expo_push_token')
      .eq('id', userId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching current push token:', fetchError);
      return;
    }
    
    const currentToken = currentData?.expo_push_token;
    // console.log('Current token in DB:', currentToken);
    // console.log('New push token:', newPushToken);
    
    // Only update if the tokens are different
    if (currentToken !== newPushToken) {
      const { error } = await supabase
        .from('profiles')
        .update({ expo_push_token: newPushToken })
        .eq('id', userId);
        
      if (error) {
        console.error('Error updating push token:', error);
      } else {
        // console.log('Push token updated successfully.');
      }
    } else {
      // console.log('Push token is already up-to-date.');
    }
  } catch (error) {
    console.error('Error in savePushToken:', error);
  }
};

