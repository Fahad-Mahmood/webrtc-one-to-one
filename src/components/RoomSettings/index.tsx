import styled from '@emotion/styled';
import React, { useState, useEffect, useRef, SetStateAction } from 'react';
import { Button, Grid, Box, TextField, Typography } from '@mui/material';
import { Mic, MicOff, Videocam, VideocamOff, Settings } from '@mui/icons-material';
import { DeviceSettingsModal } from '../modals/DeviceSettings';

const JOIN_ROOM_HEADING = 'Join Room';
const AUDIO_OPTION = 'audio';
const VIDEO_OPTION = 'video';
const INPUT_PLACEHOLDER = 'Type your name';
const JOIN_BTN_TEXT = 'Join the room';

const ICON_STYLES = { cursor: 'pointer', '&:hover': { opacity: 0.7 }, color: 'grey.200' };

const VideoPlayer = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
  transform: scale(-1, 1);
`;

interface Props {
  roomName: string;
  userName: string;
  localMediaStream: MediaStream | null;
  selectedDevices: SelectedDevices | null;
  mediaOptions: MediaOptions;
  onMediaOptionClick: (mediaOption: MediaOption) => void;
  setSelectedDevices: React.Dispatch<SetStateAction<SelectedDevices | null>>;
  onJoin: () => void;
  onUserNameInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RoomSettings: React.FC<Props> = ({
  roomName,
  userName,
  localMediaStream,
  selectedDevices,
  mediaOptions,
  onMediaOptionClick,
  setSelectedDevices,
  onJoin,
  onUserNameInput,
}) => {
  const [isSettingsModalVisible, setSettingsModalVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const isJoinBtnDisabled = userName.trim() === '';

  useEffect(() => {
    if (localMediaStream && videoRef?.current) {
      videoRef.current.srcObject = localMediaStream;
    }
  }, [localMediaStream, videoRef]);

  const onSettingsIconClick = () => {
    setSettingsModalVisible(true);
  };

  const onSettingsModalClose = (userSelectedDevices?: SelectedDevices) => {
    if (userSelectedDevices) {
      setSelectedDevices(userSelectedDevices);
    }
    setSettingsModalVisible(false);
  };

  return (
    <Grid container direction="row" justifyContent="center" alignItems="center" sx={{ height: '100vh' }}>
      <Grid
        container
        direction="column"
        alignItems={'center'}
        justifyContent="center"
        sx={{ width: ['100vw', '30vw'], height: ['50%', '100%'], bgcolor: 'primary.light' }}
      >
        <Typography color="grey.100" mb={2} align="center" gutterBottom fontWeight={500} variant="h4">
          {JOIN_ROOM_HEADING}
        </Typography>
        <Typography color="grey.100" mb={2} align="center" gutterBottom variant="h6">
          {roomName}
        </Typography>
        <TextField
          focused
          color="secondary"
          sx={{ width: '80%', mb: 2, '& input': { color: 'grey.100' } }}
          placeholder={INPUT_PLACEHOLDER}
          onChange={onUserNameInput}
        />
        <Button
          disabled={isJoinBtnDisabled}
          onClick={onJoin}
          sx={{ width: '80%', mb: 2 }}
          color="secondary"
          variant="contained"
        >
          {JOIN_BTN_TEXT}
        </Button>
        <Grid container justifyContent="space-between" sx={{ width: '80%' }}>
          <Box>
            {mediaOptions.audio ? (
              <Mic onClick={() => onMediaOptionClick(AUDIO_OPTION)} sx={{ ...ICON_STYLES }} />
            ) : (
              <MicOff onClick={() => onMediaOptionClick(AUDIO_OPTION)} sx={{ ...ICON_STYLES }} />
            )}
            {mediaOptions.video ? (
              <Videocam onClick={() => onMediaOptionClick(VIDEO_OPTION)} sx={{ ml: 1, ...ICON_STYLES }} />
            ) : (
              <VideocamOff onClick={() => onMediaOptionClick(VIDEO_OPTION)} sx={{ ml: 1, ...ICON_STYLES }} />
            )}
          </Box>
          <Settings onClick={onSettingsIconClick} sx={{ ml: 1, ...ICON_STYLES }} />
        </Grid>
      </Grid>
      <Box sx={{ width: ['100vw', '70vw'], height: ['50%', '100%'], bgcolor: 'grey.900' }}>
        {mediaOptions.video && localMediaStream ? <VideoPlayer autoPlay muted ref={videoRef} /> : null}
      </Box>
      <DeviceSettingsModal
        isOpen={isSettingsModalVisible}
        onClose={onSettingsModalClose}
        selectedDevices={selectedDevices}
      />
    </Grid>
  );
};
