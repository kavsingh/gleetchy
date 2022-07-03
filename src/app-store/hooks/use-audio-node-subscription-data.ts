import { useAppSelector } from "./base";

const useAudioNodeSubscriptionData = (id: string) =>
	useAppSelector((state) => state.audioEngine.subscriptionData[id]);

export default useAudioNodeSubscriptionData;
