import { Html, Head, Preview, Body, Container, Text, Section } from '@react-email/components';

interface VerificationEmailProps {
  username: string;
  otp: string;
}

export default function VerificationEmail({ username, otp }: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP Verification Code</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Hello, {username} 👋</Text>
          <Text style={paragraph}>
            Thank you for signing up! Please use the following one-time password (OTP) to verify your account:
          </Text>
          <Section style={codeContainer}>
            <Text style={code}>{otp}</Text>
          </Section>
          <Text style={paragraph}>
            This code is valid for the next 10 minutes. If you didn’t request this, you can safely ignore this email.
          </Text>
          <Text style={footer}>– Your Company Team</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
    backgroundColor: '#f9f9f9',
    fontFamily: 'Arial, sans-serif',
    padding: '40px 0',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    padding: '30px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 0 10px rgba(0,0,0,0.05)',
  };
  
  const heading = {
    fontSize: '20px',
    fontWeight: 'bold' as const,
    marginBottom: '20px',
  };
  
  const paragraph = {
    fontSize: '16px',
    lineHeight: '1.5',
    marginBottom: '20px',
  };
  
  const codeContainer = {
    textAlign: 'center' as const,
    margin: '30px 0',
  };
  
  const code = {
    display: 'inline-block',
    fontSize: '28px',
    fontWeight: 'bold' as const,
    padding: '10px 20px',
    backgroundColor: '#f3f3f3',
    borderRadius: '5px',
    letterSpacing: '4px',
  };
  
  const footer = {
    fontSize: '14px',
    color: '#777',
    marginTop: '30px',
  };