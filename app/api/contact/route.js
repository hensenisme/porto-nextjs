import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request) {
    try {
        const data = await request.json();
        const { name, email, subject, message } = data;

        // 1. Validasi Input
        if (!name || !email || !message) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // 2. Validasi API Key
        if (!process.env.RESEND_API_KEY) {
            console.error("RESEND_API_KEY is missing");
            return NextResponse.json(
                { message: 'Server configuration error' },
                { status: 500 }
            );
        }

        // 3. Kirim Email via Resend
        // Ganti 'onboarding@resend.dev' dengan domain terverifikasi Anda jika sudah produksi
        // Ganti 'delivered@resend.dev' dengan email tujuan Anda (misal email pribadi) di environment variable atau hardcode sementara
        const toEmail = process.env.CONTACT_EMAIL || 'hensenisme@gmail.com';
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'Portfolio Contact Form <onboarding@resend.dev>';

        const emailData = await resend.emails.send({
            from: fromEmail,
            to: toEmail, // Email tujuan
            reply_to: email,
            subject: `New Message from ${name}: ${subject || 'No Subject'}`,
            html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <div style="margin-top: 20px; padding: 15px; background-color: #f4f4f4; border-radius: 5px;">
          <strong>Message:</strong><br />
          <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
        });

        if (emailData.error) {
            console.error("Resend Error:", emailData.error);
            return NextResponse.json(
                { message: 'Failed to send email. Please try again later.' },
                { status: 500 }
            );
        }

        // 4. Sukses
        return NextResponse.json(
            { message: 'Message sent successfully!' },
            { status: 200 }
        );

    } catch (error) {
        console.error("Internal Error:", error);
        return NextResponse.json(
            { message: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
