package br.com.fbcicloturismo;

import static com.tngtech.archunit.base.DescribedPredicate.alwaysTrue;
import static com.tngtech.archunit.core.domain.JavaClass.Predicates.resideInAPackage;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.classes;
import static com.tngtech.archunit.lang.syntax.ArchRuleDefinition.noClasses;
import static com.tngtech.archunit.library.Architectures.layeredArchitecture;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_USE_FIELD_INJECTION;
import static com.tngtech.archunit.library.GeneralCodingRules.NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING;
import static com.tngtech.archunit.library.dependencies.SlicesRuleDefinition.slices;

import com.tngtech.archunit.core.importer.ImportOption;
import com.tngtech.archunit.junit.AnalyzeClasses;
import com.tngtech.archunit.junit.ArchTest;
import com.tngtech.archunit.lang.ArchRule;
import jakarta.persistence.Entity;
import java.time.Instant;
import java.time.LocalDate;
import org.springframework.data.repository.Repository;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RestController;

/**
 * As regras de organização do código, conferidas a cada build. Quem quebrar uma delas fica sabendo no teste, não na
 * revisão: a estrutura descrita no {@code package-info} da raiz deixa de ser só convenção.
 */
@AnalyzeClasses(packages = "br.com.fbcicloturismo", importOptions = ImportOption.DoNotIncludeTests.class)
class ArquiteturaTest {

	/**
	 * Dentro de cada módulo, a dependência só desce: os controllers chamam os casos de uso, que usam o domínio e os
	 * repositórios. O domínio não conhece quem o usa.
	 */
	@ArchTest
	static final ArchRule camadas = layeredArchitecture().consideringOnlyDependenciesInLayers()
			.layer("API").definedBy("..api..")
			.layer("Aplicação").definedBy("..aplicacao..")
			.layer("Domínio").definedBy("..dominio..")
			.layer("Infraestrutura").definedBy("..infraestrutura..")
			.whereLayer("API").mayNotBeAccessedByAnyLayer()
			.whereLayer("Aplicação").mayOnlyBeAccessedByLayers("API")
			.whereLayer("Infraestrutura").mayOnlyBeAccessedByLayers("Aplicação")
			.whereLayer("Domínio").mayOnlyBeAccessedByLayers("API", "Aplicação", "Infraestrutura");

	/** As regras de negócio não dependem do Spring: só das anotações de mapeamento do JPA. */
	@ArchTest
	static final ArchRule dominioIndependenteDoSpring = noClasses().that().resideInAPackage("..dominio..")
			.should().dependOnClassesThat().resideInAPackage("org.springframework..");

	/** Um módulo não usa outro diretamente; o que é comum a eles fica em {@code compartilhado}. */
	@ArchTest
	static final ArchRule modulosIndependentes = slices().matching("br.com.fbcicloturismo.(*)..")
			.should().notDependOnEachOther()
			.ignoreDependency(alwaysTrue(), resideInAPackage("br.com.fbcicloturismo.compartilhado.."));

	@ArchTest
	static final ArchRule compartilhadoNaoConheceModulos = noClasses()
			.that().resideInAPackage("br.com.fbcicloturismo.compartilhado..")
			.should().dependOnClassesThat()
			.resideInAnyPackage("br.com.fbcicloturismo.expedicao..", "br.com.fbcicloturismo.autenticacao..");

	@ArchTest
	static final ArchRule controllersNaApi = classes().that().areAnnotatedWith(RestController.class)
			.should().resideInAPackage("..api..");

	@ArchTest
	static final ArchRule casosDeUsoNaAplicacao = classes().that().areAnnotatedWith(Service.class)
			.should().resideInAPackage("..aplicacao..");

	@ArchTest
	static final ArchRule entidadesNoDominio = classes().that().areAnnotatedWith(Entity.class)
			.should().resideInAPackage("..dominio..");

	@ArchTest
	static final ArchRule repositoriosNaInfraestrutura = classes().that().areAssignableTo(Repository.class)
			.should().resideInAPackage("..infraestrutura..");

	/** "Hoje" vem sempre do {@link java.time.Clock} injetado, para os testes poderem fixar a data. */
	@ArchTest
	static final ArchRule dataSoPeloRelogio = noClasses()
			.should().callMethod(LocalDate.class, "now")
			.orShould().callMethod(Instant.class, "now")
			.because("a data atual deve vir do Clock injetado");

	@ArchTest
	static final ArchRule semInjecaoEmCampo = NO_CLASSES_SHOULD_USE_FIELD_INJECTION;

	@ArchTest
	static final ArchRule semJavaUtilLogging = NO_CLASSES_SHOULD_USE_JAVA_UTIL_LOGGING;

	@ArchTest
	static final ArchRule semSystemOut = NO_CLASSES_SHOULD_ACCESS_STANDARD_STREAMS;

}
