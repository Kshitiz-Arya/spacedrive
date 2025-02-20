import { AppLogo } from '@sd/assets/images';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerContentComponentProps } from '@react-navigation/drawer/lib/typescript/src/types';
import { CheckCircle, Gear } from 'phosphor-react-native';
import { useRef } from 'react';
import { Image, Platform, Pressable, Text, View } from 'react-native';
import { JobManagerContextProvider, useLibraryQuery } from '@sd/client';
import Layout from '~/constants/Layout';
import { tw, twStyle } from '~/lib/tailwind';
import { getStackNameFromState } from '~/utils/nav';
import { PulseAnimation } from '../animation/lottie';
import { ModalRef } from '../layout/Modal';
import { JobManagerModal } from '../modal/job/JobManagerModal';
import DrawerLibraryManager from './DrawerLibraryManager';
import DrawerLocations from './DrawerLocations';
import DrawerTags from './DrawerTags';

const drawerHeight = Platform.select({
	ios: Layout.window.height * 0.85,
	android: Layout.window.height * 0.9
});

function JobIcon() {
	const { data: isActive } = useLibraryQuery(['jobs.isActive']);
	return isActive ? (
		<PulseAnimation style={tw`h-[24px] w-[32px]`} speed={1.5} />
	) : (
		<CheckCircle color="white" size={24} />
	);
}

const DrawerContent = ({ navigation, state }: DrawerContentComponentProps) => {
	const stackName = getStackNameFromState(state);

	const modalRef = useRef<ModalRef>(null);

	return (
		<DrawerContentScrollView style={tw`flex-1 px-3 py-2`} scrollEnabled={false}>
			<View style={twStyle('justify-between', { height: drawerHeight })}>
				<View>
					<View style={tw`flex flex-row items-center`}>
						<Image source={AppLogo} style={tw`h-[40px] w-[40px]`} />
						<Text style={tw`ml-2 text-lg font-bold text-ink`}>Spacedrive</Text>
					</View>
					<View style={tw`mt-6`} />

					{/* Library Manager */}
					<DrawerLibraryManager />
					{/* Locations */}
					<DrawerLocations stackName={stackName} />
					{/* Tags */}
					<DrawerTags stackName={stackName} />
				</View>
				<View style={tw`flex w-full flex-row items-center gap-x-4`}>
					{/* Settings */}
					<Pressable onPress={() => navigation.navigate('Settings')}>
						<Gear color="white" size={24} />
					</Pressable>
					{/* Job Manager */}
					<JobManagerContextProvider>
						<Pressable onPress={() => modalRef.current?.present()}>
							<JobIcon />
						</Pressable>
						<JobManagerModal ref={modalRef} />
					</JobManagerContextProvider>
				</View>
			</View>
		</DrawerContentScrollView>
	);
};

export default DrawerContent;
