;; Sequence Management Contract

;; Constants
(define-constant err-not-found (err u102))
(define-constant err-unauthorized (err u103))
(define-constant err-invalid-frame (err u104))

;; Sequence Data
(define-map sequences uint 
  {
    owner: principal,
    name: (string-utf8 64),
    frames: (list 100 uint),
    collaborators: (list 10 principal),
    last-modified: uint
  }
)

(define-data-var sequence-counter uint u0)

;; Create new sequence
(define-public (create-sequence (name (string-utf8 64)))
  (let ((seq-id (+ (var-get sequence-counter) u1)))
    (map-set sequences seq-id
      {
        owner: tx-sender,
        name: name,
        frames: (list),
        collaborators: (list),
        last-modified: block-height
      }
    )
    (var-set sequence-counter seq-id)
    (ok seq-id)
  )
)

;; Add frame to sequence
(define-public (add-frame (sequence-id uint) (frame-id uint))
  (let ((sequence (unwrap! (map-get? sequences sequence-id) err-not-found)))
    (asserts! (or
      (is-eq (get owner sequence) tx-sender)
      (is-some (index-of? (get collaborators sequence) tx-sender))
    ) err-unauthorized)
    
    ;; Check if frame already exists in sequence
    (asserts! (is-none (index-of? (get frames sequence) frame-id)) err-invalid-frame)
    
    (map-set sequences sequence-id
      (merge sequence
        {
          frames: (unwrap! (as-max-len? (concat (get frames sequence) (list frame-id)) u100) err-unauthorized),
          last-modified: block-height
        }
      )
    )
    (ok true)
  )
)

;; Get sequence details
(define-read-only (get-sequence (sequence-id uint))
  (map-get? sequences sequence-id)
)
