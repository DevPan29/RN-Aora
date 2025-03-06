import { useEffect, useState } from "react";
import { getAllPosts } from "./appwrite";
import { Alert } from "react-native";

const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        const response = await getAllPosts();
        setData(response);
        
      } catch (error) {
        Alert.alert('Error', error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData();
  }, [])

  console.log(data)