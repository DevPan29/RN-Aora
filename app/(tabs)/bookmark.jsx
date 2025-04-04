import { View, Text, ScrollView, FlatList, RefreshControl, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import useAppwrite from '../../lib/useAppwrite'
import { getAllPosts } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
import { images } from '../../constants'
import EmptyState from '../../components/EmptyState'
import VideoCard from '../../components/VideoCard'

const Bookmark = () => {

  const { user, setUser, setIsLogged } = useGlobalContext();

  const { data: posts, refetch } = useAppwrite( () => getAllPosts(user) );

  const [refreshing, setRefreshing] = useState(false);
  
    const onRefresh = async () => {
      setRefreshing(true);
      
      await refetch();
  
      setRefreshing(false);
    }

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard videoItem={item} currentUser={user}/>
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <Text className="text-2xl text-white font-psemibold mb-6">
              Saved Videos
            </Text>
            <SearchInput
              placeholder="Search your saved videos"
            ></SearchInput>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState 
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={<RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

export default Bookmark