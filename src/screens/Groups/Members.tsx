import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {axiosUtils} from '../../Utils/axiosUtils.ts';
import {API_URL_IMAGE} from '../../../config.ts';

export const Members = ({route}) => {
  const {ApiGet, ApiDelete} = axiosUtils();
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const {group} = route.params || {}; // Add default empty object

  useEffect(() => {
    if (!group || !group.id) {
      setError('Group ID is missing');
      setLoading(false);
      return;
    }

    const fetchCurrentUser = async () => {
      try {
        const response = await ApiGet('Users/profile');
        setCurrentUser(response.data);
      } catch (error) {
        console.error('Error fetching current user:', error);
        setError('Error fetching current user');
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await ApiGet(`Teams/${group.id}/users`);
        if (Array.isArray(response.data)) {
          setMembers(response.data);
        } else {
          console.error('Expected an array but got:', response.data);
          setError('Unexpected API response format');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching members:', error);
        setError('Error fetching members');
        setLoading(false);
      }
    };

    fetchCurrentUser();
    fetchMembers();
  }, [group]);

  const handleRemoveMember = userId => {
    Alert.alert(
      'Confirm Removal',
      'Are you sure you want to remove this member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          onPress: async () => {
            try {
              await ApiDelete(`Teams/${group.id}/users/${userId}`);
              setMembers(members.filter(member => member.id !== userId));
            } catch (error) {
              console.error('Error removing member:', error);
              setError('Error removing member');
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!currentUser) {
    return <Text>Loading user information...</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {members.map(member => (
        <View key={member.id} style={styles.memberContainer}>
          <Image
            source={{
              uri: `${API_URL_IMAGE}${member.profileImagePath}`,
            }}
            style={styles.profileImage}
          />
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{member.userName}</Text>
            {member.userName !== currentUser.userName && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveMember(member.id)}>
                <Text style={styles.removeButtonText}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  memberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#d4edda', // Light green background
    padding: 10,
    borderRadius: 10,
    width: '100%',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
    color: '#333',
  },
  removeButton: {
    marginLeft: 'auto',
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
