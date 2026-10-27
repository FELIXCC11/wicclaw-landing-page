# Merchant decisions — October 22, 2026

Confirmed by the user in this session:

- Seller: Wicclaw Corp. The user requested no public address; do not invent one. Merchant legal review remains a checkout gate.
- Core: AMD Ryzen 7 7735HS, Radeon 680M, **16GB LPDDR5 RAM standard**, 1TB NVMe SSD, Wi-Fi, 4K UHD display support, Windows 11 Pro. The user confirmed a **24GB LPDDR5 option** on October 24, 2026, but its price is pending; display it as coming soon and do not make it purchasable. The Wi-Fi standard, display output port, physical ports, and dimensions remain unconfirmed.
- Core hardware: $799; reservation: $20 credited to that price; remaining hardware balance: $779 per unit. No automatic balance charge.
- International shipping is planned, with USPS or UPS fees. Exact countries, rates, duties treatment, and delivery estimates remain unconfigured. There is no carrier API connection or worldwide shipping promise.
- Tax should follow applicable rules. Registrations and merchant Stripe Tax configuration remain unverified; no tax-free promise is published.
- Core deposits are fully refundable until the remaining hardware balance is paid.
- Returns within 14 days of delivery, original condition and packaging, buyer-paid return shipping, 15% restocking fee, subject to applicable consumer rights.
- Cancellation of a fully prepaid order before shipment is **pending**. The full-payment API requires the separate `WICCLAW_FULL_PAYMENT_TERMS_APPROVED=true` gate.
- PostgreSQL and Stripe connection are postponed by the user. Hosting target is a Hostinger VPS; no Vercel migration or account creation.

The user supplied [Otto's cancellation section](https://myotto.ai/terms#cancellation) for review and explicitly approved the deposit/return adaptation above. Otto's merchant identity, $599 product price, shipment date, flat shipping charge, automatic balance charging, and unrelated terms were not adopted.

Still needed before accepting money: approved delivery estimate, physical/port/accessory details, exact destination/rate settings, tax setup, merchant legal review, service credentials, verified sender domain, completed Stripe test transactions, production hostname/HTTPS, and operational verification. The upcoming WicMini reservation is not approved.
