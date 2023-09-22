import Head from 'next/head';
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from 'src/contexts/auth-context';
import { useNProgress } from 'src/hooks/use-nprogress';
import { createTheme } from 'src/theme';
import { createEmotionCache } from 'src/utils/create-emotion-cache';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import 'simplebar-react/dist/simplebar.min.css';
import { SnackbarProvider } from 'notistack';

const clientSideEmotionCache = createEmotionCache();

const queryClient = new QueryClient();

const SplashScreen = () => null;

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  useNProgress();

  const getLayout = Component.getLayout ?? ((page) => page);

  const theme = createTheme();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          ARS
        </title>
        <meta
          name="viewport"
          content="initial-scale=0.9, width=device-width"
        />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <ThemeProvider theme={theme}>
              <SnackbarProvider maxSnack={3}>
                <CssBaseline />
                <AuthConsumer>
                  {
                    (auth) => auth.isLoading
                      ? <SplashScreen />
                      : getLayout(<Component {...pageProps} />)
                  }
                </AuthConsumer>
              </SnackbarProvider>
            </ThemeProvider>
          </AuthProvider>
        </QueryClientProvider>
      </LocalizationProvider>
    </CacheProvider>
  );
};

export default App;
