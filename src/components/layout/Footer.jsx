import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 1,
        px: 3,
        mt: 'auto',
        backgroundColor: 'background.default',
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.primary">
        © {new Date().getFullYear()} Smart Form Builder. All rights reserved.{' '}
        <a
          href="https://thecodechaser.com"
          target="_blank"
          rel="noopener noreferrer"
          className='footer-link'
        >
          thecodechaser.com
        </a>
      </Typography>
    </Box>
  );
};

export default Footer;
