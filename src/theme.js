import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: '"Roboto"',
    fontSize: 14, // taille de base en pixels (1rem = 14px)
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
        size: 'medium', // ou "small"
      },
      styleOverrides: {
        root: {
          borderRadius: 12, // Applique le border-radius de 12px
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          height: 46,
          padding: 0, // supprime les padding inutiles
          boxSizing: 'border-box',
        },
        input: {
          padding: '12px 14px', // ajuste le padding interne du texte
          height: '100%',
          borderRadius: 12, // Radius de 12px pour arrondir les coins
          boxSizing: 'border-box',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgb(33, 150, 243)', // couleur de fond
          color: 'white', // couleur du texte
          borderRadius: 12, // radius de 12px
          padding: '8px 24px', // taille du padding
          textTransform: 'none', // désactive la transformation en majuscules
          '&:hover': {
            backgroundColor: 'rgb(33, 150, 243)', // couleur de fond au survol
            opacity: 0.8, // opacité lors du survol
          },
        },
      },
    },
  },
});

export default theme;
