package com.senac.java_pi5.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.senac.java_pi5.model.Usuario;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    boolean existsByEmail(String email);
    boolean existsByCpf(String cpf);
}