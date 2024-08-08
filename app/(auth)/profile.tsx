import { View, Image, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

const Page = () => {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    loadUserAvatar();
  }, []);

  const loadUserAvatar = async () => {
    const {
      data: { user: User },
    } = await supabase.auth.getUser();

    supabase.storage
      .from('avatars')
      .download(`${User?.id}/avatar.png`)
      .then(({ data }) => {
        console.log(data);
        if (!data) return;

        const fr = new FileReader();
        fr.readAsDataURL(data!);
        fr.onload = () => {
          setImage(fr.result as string);
        };
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);

      const {
        data: { user: User },
      } = await supabase.auth.getUser();

      const img = result.assets[0];
      const base64 = await FileSystem.readAsStringAsync(img.uri, { encoding: 'base64' });
      const filePath = `${User?.id}/avatar.png`;
      const contentType = 'image/png';
      await supabase.storage.from('avatars').upload(filePath, decode(base64), { contentType });
    }
  };

  return (
    <View>
      {image && <Image source={{ uri: image }} style={styles.avatar} />}
      {!image && <View style={styles.avatar} />}
      <Button title="Set Avatar Image" onPress={pickImage} />
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 200,
    height: 200,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    borderRadius: 100,
    margin: 40,
  },
});

export default Page;