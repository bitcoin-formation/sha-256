# Implémentation SHA-256 en Python (code éducatif)
# Ce code est affiché dans l'interface pour suivre l'exécution

def rotr(x, n):
    """Rotation circulaire à droite de n bits"""
    return ((x >> n) | (x << (32 - n))) & 0xFFFFFFFF

def shr(x, n):
    """Décalage à droite de n bits"""
    return x >> n

def sigma0(x):
    """σ0(x) = ROTR⁷(x) ⊕ ROTR¹⁸(x) ⊕ SHR³(x)"""
    return rotr(x, 7) ^ rotr(x, 18) ^ shr(x, 3)

def sigma1(x):
    """σ1(x) = ROTR¹⁷(x) ⊕ ROTR¹⁹(x) ⊕ SHR¹⁰(x)"""
    return rotr(x, 17) ^ rotr(x, 19) ^ shr(x, 10)

def capsigma0(x):
    """Σ0(x) = ROTR²(x) ⊕ ROTR¹³(x) ⊕ ROTR²²(x)"""
    return rotr(x, 2) ^ rotr(x, 13) ^ rotr(x, 22)

def capsigma1(x):
    """Σ1(x) = ROTR⁶(x) ⊕ ROTR¹¹(x) ⊕ ROTR²⁵(x)"""
    return rotr(x, 6) ^ rotr(x, 11) ^ rotr(x, 25)

def ch(x, y, z):
    """Ch(x,y,z) = (x ∧ y) ⊕ (¬x ∧ z)"""
    return (x & y) ^ (~x & z)

def maj(x, y, z):
    """Maj(x,y,z) = (x ∧ y) ⊕ (x ∧ z) ⊕ (y ∧ z)"""
    return (x & y) ^ (x & z) ^ (y & z)

# Constantes (premières 32 bits des racines cubiques des 64 premiers nombres premiers)
K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5,
    0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    # ... (64 constantes au total)
]

# Valeurs initiales (premières 32 bits des racines carrées des 8 premiers nombres premiers)
H = [
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]

def prepare_message_schedule(block):
    """Prépare le message schedule W[0..63]"""
    W = [0] * 64
    
    # Les 16 premiers mots viennent du message
    for i in range(16):
        W[i] = int.from_bytes(block[i*4:(i+1)*4], 'big')
    
    # Étendre les 48 mots restants
    for i in range(16, 64):
        s0 = sigma0(W[i-15])
        s1 = sigma1(W[i-2])
        W[i] = (W[i-16] + s0 + W[i-7] + s1) & 0xFFFFFFFF
    
    return W

def sha256_compression(block, H):
    """Fonction de compression SHA-256 pour un bloc"""
    W = prepare_message_schedule(block)
    
    # Initialiser les variables de travail
    a, b, c, d, e, f, g, h = H
    
    # 64 rounds de compression
    for i in range(64):
        S1 = capsigma1(e)
        ch_result = ch(e, f, g)
        temp1 = (h + S1 + ch_result + K[i] + W[i]) & 0xFFFFFFFF
        
        S0 = capsigma0(a)
        maj_result = maj(a, b, c)
        temp2 = (S0 + maj_result) & 0xFFFFFFFF
        
        # Mise à jour des variables
        h = g
        g = f
        f = e
        e = (d + temp1) & 0xFFFFFFFF
        d = c
        c = b
        b = a
        a = (temp1 + temp2) & 0xFFFFFFFF
    
    # Ajouter le résultat compressé au hash
    H[0] = (H[0] + a) & 0xFFFFFFFF
    H[1] = (H[1] + b) & 0xFFFFFFFF
    H[2] = (H[2] + c) & 0xFFFFFFFF
    H[3] = (H[3] + d) & 0xFFFFFFFF
    H[4] = (H[4] + e) & 0xFFFFFFFF
    H[5] = (H[5] + f) & 0xFFFFFFFF
    H[6] = (H[6] + g) & 0xFFFFFFFF
    H[7] = (H[7] + h) & 0xFFFFFFFF
    
    return H

def sha256(message):
    """Calcule le hash SHA-256 d'un message"""
    # Padding du message
    msg_bytes = message.encode('utf-8')
    msg_len = len(msg_bytes)
    msg_bits = msg_len * 8
    
    # Ajouter le bit 1
    padded = msg_bytes + b'\x80'
    
    # Ajouter des zéros jusqu'à 448 bits (mod 512)
    while (len(padded) % 64) != 56:
        padded += b'\x00'
    
    # Ajouter la longueur sur 64 bits
    padded += msg_bits.to_bytes(8, 'big')
    
    # Traiter chaque bloc de 512 bits
    for i in range(0, len(padded), 64):
        block = padded[i:i+64]
        H = sha256_compression(block, H)
    
    # Produire le hash final
    return ''.join(format(h, '08x') for h in H)

