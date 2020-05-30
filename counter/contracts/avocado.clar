
;; A simple smart contract to model supply chain of avocados
(define-constant avocado-hell 'SZ2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKQ9H6DPR)

(define-fungible-token avocados)

(define-public (how-many-avocados)
  (ok (ft-get-balance avocados tx-sender)))

(define-public (grow-more-avocados)
   (ok (ft-mint? avocados u1 tx-sender)))

(define-public (eat-avocado) 
   (ok (ft-transfer? avocados u1 tx-sender avocado-hell)))
