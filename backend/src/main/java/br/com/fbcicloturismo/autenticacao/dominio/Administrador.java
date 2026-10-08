package br.com.fbcicloturismo.autenticacao.dominio;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.time.Instant;
import java.util.Locale;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/** Quem opera o painel do ADM. Só o hash da senha é guardado; quem gera e confere o hash é a camada de aplicação. */
@Entity
public class Administrador {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String email;

	private String nome;

	private String senhaHash;

	private boolean ativo = true;

	@CreationTimestamp
	private Instant criadoEm;

	@UpdateTimestamp
	private Instant atualizadoEm;

	protected Administrador() {
	}

	public Administrador(String email, String nome, String senhaHash) {
		this.email = normalizarEmail(email);
		this.nome = nome;
		this.senhaHash = senhaHash;
	}

	/** E-mails são comparados sem diferenciar maiúsculas e sem espaços nas pontas. */
	public static String normalizarEmail(String email) {
		return email.strip().toLowerCase(Locale.ROOT);
	}

	public void desativar() {
		ativo = false;
	}

	public Long getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getNome() {
		return nome;
	}

	public String getSenhaHash() {
		return senhaHash;
	}

	public boolean isAtivo() {
		return ativo;
	}

	public Instant getCriadoEm() {
		return criadoEm;
	}

	public Instant getAtualizadoEm() {
		return atualizadoEm;
	}

}
