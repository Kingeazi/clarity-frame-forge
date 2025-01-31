;; Frame NFT Implementation
(define-non-fungible-token frame uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))

;; Frame Data
(define-map frame-data uint 
  {
    creator: principal,
    title: (string-utf8 64),
    image-uri: (string-utf8 256),
    timestamp: uint
  }
)

;; Token ID counter
(define-data-var last-token-id uint u0)

;; Mint new frame
(define-public (mint-frame (title (string-utf8 64)) (image-uri (string-utf8 256)))
  (let ((token-id (+ (var-get last-token-id) u1)))
    (try! (nft-mint? frame token-id tx-sender))
    (map-set frame-data token-id
      {
        creator: tx-sender,
        title: title,
        image-uri: image-uri,
        timestamp: block-height
      }
    )
    (var-set last-token-id token-id)
    (ok token-id)
  )
)

;; Transfer frame
(define-public (transfer-frame (token-id uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender (unwrap! (nft-get-owner? frame token-id) err-not-token-owner)) err-not-token-owner)
    (try! (nft-transfer? frame token-id tx-sender recipient))
    (ok true)
  )
)
