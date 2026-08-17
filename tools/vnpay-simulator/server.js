#!/usr/bin/env node
// ============================================================================
// VNPAY Callback Simulator — Mock payment gateway for local development
// ============================================================================
// This simulates the VNPAY sandbox environment for testing payment flows.
// In production, real VNPAY endpoints are used instead.
// ============================================================================

import http from 'node:http'
import crypto from 'node:crypto'

const PORT = parseInt(process.env.PORT || '9090', 10)
const TMN_CODE = process.env.VNPAY_TMN_CODE || 'TEST01'
const HASH_SECRET = process.env.VNPAY_HASH_SECRET || 'test-secret'
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:3001/api/payments/vnpay/callback'

/**
 * Generate a secure hash simulating VNPAY's HMAC-SHA512 signing
 */
function createSecureHash(params) {
  const sortedKeys = Object.keys(params).sort()
  const signData = sortedKeys.map((k) => `${k}=${params[k]}`).join('&')
  return crypto.createHmac('sha512', HASH_SECRET).update(signData).digest('hex')
}

/**
 * Simulate payment page — renders a form that auto-submits back to callback
 */
function renderPaymentPage(txnRef, amount, returnUrl) {
  const responseCode = Math.random() > 0.1 ? '00' : '24' // 90% success rate
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>VNPAY Simulator — Thanh toán giả lập</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 480px; margin: 80px auto; padding: 20px; background: #f5f5f5; }
    .card { background: white; border-radius: 12px; padding: 32px; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    h1 { color: #c92127; font-size: 20px; margin-bottom: 8px; }
    .amount { font-size: 28px; font-weight: 700; color: #1a1a1a; margin: 16px 0; }
    .info { color: #666; font-size: 14px; margin: 4px 0; }
    .status { padding: 12px 16px; border-radius: 8px; margin: 20px 0; font-weight: 500; }
    .status.success { background: #e8f5e9; color: #2e7d32; }
    .status.fail { background: #ffebee; color: #c62828; }
    .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; background: #fff3e0; color: #e65100; font-size: 12px; font-weight: 500; }
    button { margin-top: 20px; padding: 12px 32px; border: none; border-radius: 8px; font-size: 16px; font-weight: 600; cursor: pointer; }
    .btn-pay { background: #c92127; color: white; }
    .btn-pay:hover { background: #a01b22; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🧪 MÔI TRƯỜNG GIẢ LẬP</span>
    <h1>VNPAY — Cổng thanh toán</h1>
    <div class="amount">${Number(amount).toLocaleString('vi-VN')} ₫</div>
    <p class="info">Mã giao dịch: <strong>${txnRef}</strong></p>
    <p class="info">Merchant: ${TMN_CODE}</p>
    <div class="status ${responseCode === '00' ? 'success' : 'fail'}">
      ${responseCode === '00' ? '✅ Giao dịch thành công' : '❌ Giao dịch thất bại (mã lỗi 24)'}
    </div>
    <p style="color: #999; font-size: 12px;">Callback sẽ được gửi tới: ${CALLBACK_URL}</p>
    <button class="btn-pay" onclick="submitPayment()">Xác nhận thanh toán</button>
  </div>
  <script>
    function submitPayment() {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = '${returnUrl || CALLBACK_URL}';
      const fields = {
        vnp_TxnRef: '${txnRef}',
        vnp_Amount: '${amount}',
        vnp_ResponseCode: '${responseCode}',
        vnp_TransactionStatus: '${responseCode === '00' ? '00' : '02'}',
        vnp_SecureHash: '${createSecureHash({ vnp_TxnRef: txnRef, vnp_ResponseCode: responseCode })}'
      };
      for (const [k, v] of Object.entries(fields)) {
        const input = document.createElement('input');
        input.type = 'hidden'; input.name = k; input.value = v;
        form.appendChild(input);
      }
      document.body.appendChild(form);
      form.submit();
    }
  </script>
</body>
</html>`
}

/**
 * Create payment URL — simulates VNPAY payment URL generation
 */
function createPaymentUrl(txnRef, amount, returnUrl) {
  const baseUrl = `http://localhost:${PORT}`
  const params = new URLSearchParams({
    vnp_TxnRef: txnRef,
    vnp_Amount: String(amount),
    vnp_ReturnUrl: returnUrl || CALLBACK_URL,
    vnp_TmnCode: TMN_CODE,
  })
  return `${baseUrl}/pay?${params.toString()}`
}

/**
 * IPN endpoint — simulates VNPAY Instant Payment Notification
 */
function handleIpn(txnRef, responseCode) {
  const secureHash = createSecureHash({ vnp_TxnRef: txnRef, vnp_ResponseCode: responseCode })
  return {
    RspCode: '00',
    Message: 'Confirm Success',
    vnp_TxnRef: txnRef,
    vnp_ResponseCode: responseCode,
    vnp_SecureHash: secureHash,
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)

  // Health check
  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }))
    return
  }

  // Create payment URL API
  if (url.pathname === '/api/create-payment' && req.method === 'POST') {
    let body = ''
    req.on('data', (chunk) => (body += chunk))
    req.on('end', () => {
      try {
        const { txnRef, amount, returnUrl } = JSON.parse(body)
        if (!txnRef || !amount) {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'txnRef and amount required' }))
          return
        }
        const paymentUrl = createPaymentUrl(txnRef, amount, returnUrl)
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(
          JSON.stringify({
            paymentUrl,
            txnRef,
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(),
          }),
        )
      } catch {
        res.writeHead(400, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ error: 'Invalid JSON' }))
      }
    })
    return
  }

  // Payment page
  if (url.pathname === '/pay') {
    const txnRef = url.searchParams.get('vnp_TxnRef') || 'unknown'
    const amount = url.searchParams.get('vnp_Amount') || '0'
    const returnUrl = url.searchParams.get('vnp_ReturnUrl') || CALLBACK_URL
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
    res.end(renderPaymentPage(txnRef, amount, returnUrl))
    return
  }

  // IPN simulation
  if (url.pathname === '/api/ipn') {
    const txnRef = url.searchParams.get('vnp_TxnRef')
    const responseCode = url.searchParams.get('vnp_ResponseCode') || '00'
    const result = handleIpn(txnRef, responseCode)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
    return
  }

  res.writeHead(404, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify({ error: 'Not found' }))
})

server.listen(PORT, () => {
  console.log(`🏦 VNPAY Simulator running on http://localhost:${PORT}`)
  console.log(`   Health: http://localhost:${PORT}/health`)
  console.log(`   Create payment: POST http://localhost:${PORT}/api/create-payment`)
  console.log(`   IPN simulation: GET http://localhost:${PORT}/api/ipn?vnp_TxnRef=...`)
})
