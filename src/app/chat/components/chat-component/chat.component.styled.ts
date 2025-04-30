import { styled } from '@nextui-org/react';

const ChatComponentStyled = styled('div', {
  display: 'flex',
  flexDirection: 'column-reverse',
  margin: '10px auto',
  paddingBottom: '50px',
  width: '70vw',
  overflow: 'auto',
  height: '100vh',
  maxHeight: '70vh',
});

const ChatInputStyled = styled('div', {
  maxWidth: '100%',
  bottom: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

const GradientText = styled('p', {
  fontSize: '1.25rem',
  lineHeight: '1.5',
  fontWeight: 'bold',
  textTransform: 'none',

  variants: {
    isAeternus: {
      true: {
        backgroundImage: 'linear-gradient(45deg, #2563eb -20%, #ec4899 50%)', // blue600 & pink600
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: '#ffffff',
      },
      false: {
        backgroundImage: 'linear-gradient(45deg, #ca8a04 -20%, #dc2626 100%)', // yellow600 & red600
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        color: '#ffffff',
      },
    },
  },

  defaultVariants: {
    isAeternus: false,
  },
});

const ChatTextStyled = styled('div', {
  '& p, & li, & li > p': {
    fontSize: '1.3rem',
    fontWeight: '600',
  },
  '& > p > strong': {
    fontSize: '1rem',
    fontWeight: '800',
  },
  '& li > p > strong, & li > strong': {
    fontSize: '1.3rem',
    fontWeight: '800',
  },
  '& a': {
    borderBottom: '1px solid $yellow500',
    fontSize: '1rem',
    fontWeight: '600',
  },
});

export { ChatTextStyled, ChatComponentStyled, ChatInputStyled, GradientText };
