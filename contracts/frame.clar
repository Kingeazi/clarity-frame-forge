;; Frame NFT Implementation
(define-non-fungible-token frame uint)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-token-owner (err u101))
(define-constant err-invalid-token (err u102))
(define-constant err-empty-string (err u103))
(define-constant err-max-supply (err u104))
(define-constant max-supply u10000)

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

;; Validation helpers
(define-private (is-valid-string (str (string-utf8 256)))
  (not (is-eq (len str) u0))
)

;; Check if token exists
(define-private (is-token-exists (token-id uint))
  (is-some (nft-get-owner? frame token-id))
)

;; Mint new frame
(define-public (mint-frame (title (string-utf8 64)) (image-uri (string-utf8 256)))
  (let 
    (
      (token-id (+ (var-get last-token-id) u1))
    )
    (asserts! (is-valid-string title) err-empty-string)
    (asserts! (is-valid-string image-uri) err-empty-string)
    (asserts! (<= token-id max-supply) err-max-supply)
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

;; Rest of the contract remains unchanged...
